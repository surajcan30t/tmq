"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ResultDialog } from "./result-dialog";
import { SubmitDialog } from "./submit-dialog";
import { QuestionNavigation } from "./question-navigation";
import { QuestionCard } from "./question-card";
import { ProgressTracker } from "./progress-tracker";
import { TestTimer } from "./test-timer";
import { testQuestions } from "@/misc/sampleQuestions";


interface Answers{
  value: string | null,
  type: string
}
const MainExam = ({testId}:{testId:string}) => {
  const [currentQuestion, setCurrentQuestion] = useState(1); // 1-indexed for user display
    const [answers, setAnswers] = useState<(Answers)[]>(
      Array(testQuestions.length).fill({value: null, type: ""})
    );
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [showResultDialog, setShowResultDialog] = useState(false);
    const [score, setScore] = useState(0);
    const [testCompleted, setTestCompleted] = useState(false);
    const [timeTaken, setTimeTaken] = useState("00:00");
    const router = useRouter()
  
    // Test duration in seconds (60 minutes)
    const TEST_DURATION = 60 * 30;
  
    const handleAnswerChange = (value: string) => {
      const newAnswers = [...answers];
      console.log('handleanswerchange: ', newAnswers[currentQuestion - 1], ' :: value: ', value)
      if(value !== ''){
        newAnswers[currentQuestion - 1] = {value: value, type: 'answered'};
        setAnswers(newAnswers);
      } else {
        newAnswers[currentQuestion - 1] = {value: null, type: 'unanswered'};
        setAnswers(newAnswers);
      }
    };
  
    const handleMarkedForReview = (
      value: string,
      markedForReviewAnswered: boolean
    ) => {
      const newAnswers = [...answers];
      if (markedForReviewAnswered) {
        newAnswers[currentQuestion - 1] = {value: value, type: 'answeredmarkedreview'};
        setAnswers(newAnswers);
      }
      else {
        newAnswers[currentQuestion - 1] = {value: null, type: 'unansweredmarkedreview'};
        setAnswers(newAnswers)
      }
    };
  
    const handleNext = () => {
      if (currentQuestion < testQuestions.length) {
        setCurrentQuestion(currentQuestion + 1);
      }
    };
  
    // const handlePrevious = () => {
    //   if (currentQuestion > 1) {
    //     setCurrentQuestion(currentQuestion - 1);
    //   }
    // };
  
    const handleQuestionSelect = (questionNumber: number) => {
      setCurrentQuestion(questionNumber);
    };
  
    const handleTimeUp = () => {
      if (!testCompleted) {
        handleSubmitTest();
      }
    };
  
    const handleSubmitTest = () => {
      // Calculate score
      let correctCount = 0;
      answers.forEach((answer, index) => {
        if (answer.value === testQuestions[index].correctAnswer) {
          correctCount++;
        }
      });
  
      console.log(correctCount)
  
      setScore(correctCount);
      setTestCompleted(true);
      setShowResultDialog(true);
  
      // Calculate time taken (60 minutes minus time left)
      const timeSpentInSeconds = TEST_DURATION - 0; // In a real app, you'd subtract the actual time left
      const minutes = Math.floor(timeSpentInSeconds / 60);
      const seconds = timeSpentInSeconds % 60;
      setTimeTaken(
        `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
    };

    const answeredCount = answers.filter((answer) => answer.value !== null).length;
    const currentQuestionData = testQuestions[currentQuestion - 1]; // Adjust for 0-indexed array
  
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-6xl mx-auto w-full">
          {/* Header with title and timer */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="text-2xl font-bold">
              {testId} : Assessment in Progress
            </div>
            <TestTimer initialTime={TEST_DURATION} onTimeUp={handleTimeUp} />
          </div>
  
          {/* Progress tracker */}
          <ProgressTracker
            currentQuestion={currentQuestion}
            totalQuestions={testQuestions.length}
            answeredCount={answeredCount}
          />
  
          {/* Question card */}
          <div className="flex flex-row justify-center items-start gap-2">
            <QuestionCard
              questionNumber={currentQuestion}
              totalQuestions={testQuestions.length}
              question={currentQuestionData.question}
              options={currentQuestionData.options}
              selectedAnswer={answers[currentQuestion - 1].value}
              onAnswerChange={handleAnswerChange}
              onMarkedForReview={handleMarkedForReview}
              onNext={handleNext}
              onSubmit={() => setShowSubmitDialog(true)}
            />
  
            {/* Question navigation */}
            <QuestionNavigation
              totalQuestions={testQuestions.length}
              currentQuestion={currentQuestion}
              answers={answers}
              onQuestionSelect={handleQuestionSelect}
            />
          </div>
        </div>
  
        {/* Submit Confirmation Dialog */}
        <SubmitDialog
          isOpen={showSubmitDialog}
          onOpenChange={setShowSubmitDialog}
          onSubmit={handleSubmitTest}
          totalQuestions={testQuestions.length}
          answeredCount={answeredCount}
        />
  
        {/* Results Dialog */}
        <ResultDialog
          isOpen={showResultDialog}
          onOpenChange={setShowResultDialog}
          onReturn={() => router.push("/")}
          score={score}
          totalQuestions={testQuestions.length}
          timeTaken={timeTaken}
        />
      </main>
    );
}

export default MainExam