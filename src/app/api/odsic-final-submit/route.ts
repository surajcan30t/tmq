import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { tokenValidation } from "../../../../services/token-validation-service";

interface RequestBody {
  testId: number
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('cookie');
    const token = authHeader
      ?.split(';')
      .find((cookie) => cookie.trim().startsWith('auth-token='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json(
        { message: 'Token unavailable' },
        { status: 403 },
      );
    }

    const tokenData = await tokenValidation(token);

    if (!tokenData?.success) {
      return NextResponse.json({ message: 'Session Expired' }, { status: 403 });
    }

    //@ts-expect-error: id exists in payload
    const id: number = tokenData.payload.id;
    const body: RequestBody = await request.json();
    const { testId } = body;
    const examUserId = id.toString() + testId.toString();
    const userData = await redis.get(id.toString());
    
    if (!userData)
      return NextResponse.json({ message: 'No user found' }, { status: 404 });
    const parsedData = JSON.parse(userData);
    const data = {
      ...parsedData,
      isFinalSubmit: true
    };
    
    const examData = await redis.get(examUserId);

    if (!examData)
      return NextResponse.json({ message: 'No data found' }, { status: 404 });
    
    const parsedExamData = JSON.parse(examData);
    const eData = {
      ...parsedExamData,
      isFinalSubmit: true
    };

    await redis.set(id.toString(), JSON.stringify(data));
    await redis.set(examUserId, JSON.stringify(eData));

    return NextResponse.json({message: 'Exam successfully submitted'}, { status: 200 });
  } catch (err) {
    console.log('::api/odsic-final-submit:: ', err);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 200 },
    );
  }
}
