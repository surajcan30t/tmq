import { NextRequest, NextResponse } from 'next/server';
import { tokenValidation } from '../../../../services/token-validation-service';
import { PrismaClient } from '@prisma/client';
import { redis } from '@/lib/redis';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  const searchParams = request.nextUrl.searchParams;

  if (!token) {
    return NextResponse.json({ message: 'Token available' }, { status: 403 });
  }

  const tokenData = await tokenValidation(token);

  if (!tokenData?.success) {
    return NextResponse.json({ message: 'Session Expired' }, { status: 403 });
  }
  try {
    //@ts-expect-error: id exists in payload
    const id: number = tokenData.payload.id;
    const examId = searchParams.get('examId');

    if (!examId)
      return NextResponse.json(
        { message: 'Provide essential data' },
        { status: 404 },
      );

    // const questionLabelData = await prisma.questionLabel.findMany({
    //   where: {
    //     id_exam: parseInt(examId),
    //   },
    //   select: {
    //     id_section: true,
    //     id_category: true,
    //     qns_no: true,
    //   },
    // });

    // const questionsByCategory = await prisma.$transaction(
    //   questionLabelData.map((item) => {
    //     return prisma.$queryRaw`
    //     SELECT id, description FROM questions
    //     WHERE id_section = ${item.id_section}
    //       AND id_category = ${item.id_category}
    //     ORDER BY RAND()
    //     LIMIT ${item.qns_no}
    //   `;
    //   }),
    // );

    // const allQuestions = questionsByCategory.flat();

    // //@ts-expect-error: id exists in payload
    // const questionIds = allQuestions.map((q) => q.id);

    // const options = await prisma.propositions.findMany({
    //   where: {
    //     id_question: { in: questionIds },
    //   },
    //   select: {
    //     id: true,
    //     answer: true,
    //     id_question: true,
    //   },
    // });

    // const optionsMap = options.reduce(
    //   (acc, opt) => {
    //     if (!acc[opt.id_question]) acc[opt.id_question] = [];

    //     acc[opt.id_question].push({option: opt.answer });
    //     return acc;
    //   },
    //   {} as Record<number, {option: string }[]>,
    // );

    // const questionWithOptions = allQuestions.map((q:any) => ({
    //   id: q.id,
    //   description: q.description,
    //   options: optionsMap[q.id] || [],
    // }));
    type RawRow = {
      result: Result
    };

    type Result = {
      duration: number,
      questions: QuestionGroup[]
    }

    type Option = {
      option_id: number;
      text: string;
    };

    type QuestionGroup = {
      question_id: number;
      question: string;
      options: Option[];
    };

    const redId = id.toString() + examId.toString();

    const cachedData = await redis.get(redId);

    if (cachedData !== null) {
      console.log('sent cached data');
      return NextResponse.json(
        { from: 'redis', data: JSON.parse(cachedData) },
        { status: 200 },
      );
    }

    const result = await prisma.$queryRaw<RawRow[]>`
    SELECT JSON_OBJECT(
    'duration', (SELECT sec_time FROM exams WHERE id=${examId}),
    'questions', (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'question_id', q.id,
                'question', q.description,
                'options', (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'option_id', p.id,
                            'text', p.answer,
                            'is_correct', p.correct
                        )
                    )
                    FROM propositions p
                    WHERE p.id_question = q.id
                )
            )
        )
        FROM (
            SELECT 
                nq.id,
                nq.description
            FROM (
                SELECT 
                    q.id,
                    q.description,
                    q.id_section,
                    q.id_category,
                    l.qns_no,
                    l.id_exam,
                    @row_num := IF(@current_section_level = CONCAT(q.id_section, q.id_category), @row_num + 1, 1) AS row_num,
                    @current_section_level := CONCAT(q.id_section, q.id_category) AS current_section_level
                FROM 
                    questions q
                JOIN 
                    question_label l
                ON 
                    q.id_section = l.id_section AND q.id_category = l.id_category
                CROSS JOIN
                    (SELECT @row_num := 0, @current_section_level := NULL) vars
                ORDER BY 
                    q.id_section, q.id_category, RAND()
            ) AS nq
            WHERE nq.row_num <= nq.qns_no AND nq.id_exam = ${examId}
        ) q
      )
    ) AS result;
    `;
    if (!result) {
      return NextResponse.json(
        { status: 500, message: 'Error collecting question ' },
        { status: 500 },
      );
    }
    const rawResult = result[0]?.result;
    console.log('rawresult')
    if (!rawResult) {
      return NextResponse.json(
        { status: 500, message: 'Invalid format' },
        { status: 500 },
      );
    }

    // Prepare data for frontend (no correct answers)
    const questions = rawResult.questions.map((q: any, id: number) => ({
      slNo: id+1,
      ...q,
      options: q.options.map(({ is_correct, ...rest }: any) => rest),
      answeredOption: null,
      appearStatus: 'unvisited',
      attemptTime: null
    }));

    // Prepare conf (correct answer map)
    const conf = rawResult.questions.reduce((acc: any, q: any) => {
      const correctOption = q.options.find((opt: any) => opt.is_correct === 1);
      if (correctOption) {
        acc[parseInt(q.question_id)] = correctOption.option_id;
      }
      return acc;
    }, {});

    await redis.set(redId, JSON.stringify({ questions, conf, duration: rawResult.duration, exam_status: 0, time_elapsed: null , timeRemaining: rawResult.duration}));

    return NextResponse.json({ from: 'db', data: questions, duration: rawResult.duration }, { status: 200 });
  } catch (err) {
    console.error('::api/get-questions-by-id::', err);
    return NextResponse.json(
      { status: 500, message: 'Something Went Wrong ' },
      { status: 500 },
    );
  }
}
