import MainExam from "@/app/(test)/components/main-exam";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Test Dashboard`,
  description: "",
};

const page = async ({
  params,
}: {
  params: Promise<{ testid: string }>;
}) => {
  const { testid } = await params
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <MainExam testId={testid}/>
    </main>
  );
}

export default page
