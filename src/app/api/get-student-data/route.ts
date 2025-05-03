import { NextRequest, NextResponse } from 'next/server';
import { tokenValidation } from '../../../../services/token-validation-service';
// import { PrismaClient } from '@prisma/client';
import { redis } from '@/lib/redis';
import { OSDICQuestions } from '@/misc/OSDICQuestions';
import { OSDICAnswers } from '@/misc/OSDICAnswers';

// const prisma = new PrismaClient();

// type RawRow = {
//   result: Result;
// };

// type Result = {
//   duration: number;
//   questions: QuestionGroup[];
// };

// type Option = {
//   option_id: number;
//   text: string;
// };

// type QuestionGroup = {
//   question_id: number;
//   question: string;
//   options: Option[];
// };

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  

  if (!token) {
    return NextResponse.json({ message: 'Token unavailable' }, { status: 403 });
  }

  const tokenData = await tokenValidation(token);

  if (!tokenData?.success) {
    return NextResponse.json({ message: 'Session Expired' }, { status: 403 });
  }
  try {
    const studentKeys = await redis.keys('student:*');
    const students = [];

    for (const key of studentKeys) {
      const data = await redis.get(key);
      if (data) {
        const student = JSON.parse(data);
        students.push({
          email: key.split(':')[1],
          name: student.name,
          branch: student.branch,
          collegeName: student.collegeName,
          contactNo: student.contactNo,
          semester: student.semester,
          score: student.score
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        students,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error('::api/get-student-data::', err);
    return NextResponse.json(
      { message: 'Something Went Wrong ' },
      { status: 500 },
    );
  }
}
