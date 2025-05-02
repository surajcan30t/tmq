import Login from "@/components/Login";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: 'Login | ODSIC Test Portal'
}

export default function page() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-zinc-200">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">ODSIC Exam Portal</h1>
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

