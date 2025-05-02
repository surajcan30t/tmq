import React from 'react';

interface StudentData {
  email: string | null;
  name: string | null;
  branch: string | null;
  collegeName: string | null;
  contactNo: string | null;
  score: number | null;
}

const StudentData = ({ data }: { data: StudentData }) => {
  return (
    <div className="w-[50vw] border-2 rounded-lg px-5 py-2">
      <div className="flex justify-start bg-blue-500 text-white mb-2 p-1">
        <strong className="text-start text-2xl font-bold">{data.email}</strong>
      </div>
      <div className="grid grid-cols-2 gap-2 text-lg">
        <div className="flex flex-col">
          <div>Name: {data.name ?? 'N/A'}</div>
          <div>Contact: {data.contactNo ?? 'N/A'}</div>
        </div>
        <div className="flex flex-col">
          <div>College Name: {data.collegeName ?? 'N/A'}</div>
          <div>Branch: {data.branch ?? 'N/A'}</div>
        </div>
      </div>
      <div className="flex justify-start border-4 border-red-500 rounded-lg mt-2 p-1">
        <strong className="text-start text-2xl font-bold">Score: {data.score}/25</strong>
      </div>
    </div>
  );
};

export default StudentData;
