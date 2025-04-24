import MainExam from '@/app/(test)/components/main-exam';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: `Test Dashboard`,
  description: '',
};

const getQuestions = async (cookie: string, testId: number) => {
  try {
    const response = await fetch(`${process.env.NEXT_BACKEND_URL}/api/get-questions-by-id?examId=${testId}`, {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    });
    const data = await response.json()
    const sanitizedQuestions = data?.data[0].result?.questions?.map((question: any) => ({
      ...question,
      options: question.options.map(({ is_correct, ...rest }: any) => rest), // Remove is_correct
    }));
    console.log('exam time', JSON.stringify(sanitizedQuestions, null, 2))
    return {
      exam_time: data.data[0].result.exam_time,
      questions: sanitizedQuestions,
    };
  } catch (err) {
    console.error('::exam/page.tsx::\n', err);
  }
};

const page = async ({ params }: { params: Promise<{ testid: string }> }) => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('auth-token')?.value;

  const { testid } = await params;
  if (!cookie || !testid) {
    return redirect('/');
  }
  const questionData = await getQuestions(cookie, parseInt(testid))

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <MainExam testId={testid} questions={questionData?.questions}/>
    </main>
  );
};

export default page;
