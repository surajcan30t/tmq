import Login from "@/components/Login";
import React from "react";

export default function page() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-zinc-200">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Exam Portal</h1>
            <p className="text-muted-foreground mt-2">
              Login to start your assessment
            </p>
          </div>
          <Login />
        </div>
      </main>
    </>
  );
}
