'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ResultDialog } from './result-dialog';
import { SubmitDialog } from './submit-dialog';
import { QuestionNavigation } from './question-navigation';
import { QuestionCard } from './question-card';
import { ProgressTracker } from './progress-tracker';
import { TestTimer } from './test-timer';
// import { testQuestions } from '@/misc/sampleQuestions';

interface Answers{
  id: number | undefined
  value: string | null,
  type: string
}

interface Option {
  text: string;
  option_id: number;
}

interface Question {
  options: Option[];
  question: string;
  question_id: number;
}


const MainExam = ({
  testId,
  questions,
}: {
  testId: string;
  questions: Question[];
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(1); // 1-indexed for user display
  const [answers, setAnswers] = useState<Answers[]>(
    Array(questions.length).fill({ id: undefined, value: null, type: '' }),
  );
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  // const [score, setScore] = useState(0);
  const [testCompleted, setTestCompleted] = useState(false);
  // const [timeTaken, setTimeTaken] = useState("00:00");
  const router = useRouter();

  // Test duration in seconds (60 minutes)
  const TEST_DURATION = 60 * 30;

  const handleAnswerChange = (value: string, id: number | undefined) => {
    const newAnswers = [...answers];
    console.log(
      'handleanswerchange: ',
      newAnswers[currentQuestion - 1],
      ' :: value: ',
      value,
    );
    if (value !== '' && id !== undefined) {
      newAnswers[currentQuestion - 1] = { id: id, value: value, type: 'answered' };
      setAnswers(newAnswers);
    } else {
      newAnswers[currentQuestion - 1] = { id: undefined, value: null, type: 'unanswered' };
      setAnswers(newAnswers);
    }
  };

  const handleMarkedForReview = (
    id: number | undefined,
    value: string,
    markedForReviewAnswered: boolean,
  ) => {
    const newAnswers = [...answers];
    if (markedForReviewAnswered) {
      newAnswers[currentQuestion - 1] = {
        id: id,
        value: value,
        type: 'answeredmarkedreview',
      };
      setAnswers(newAnswers);
    } else {
      newAnswers[currentQuestion - 1] = {
        id: undefined, 
        value: null,
        type: 'unansweredmarkedreview',
      };
      setAnswers(newAnswers);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length) {
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

    console.log('::::::::::::::\n', answers);

    // setScore(correctCount);
    setTestCompleted(true);
    setShowResultDialog(true);
  };

  const answeredCount = answers.filter(
    (answer) => answer.value !== null,
  ).length;
  const currentQuestionData = questions[currentQuestion - 1]; // Adjust for 0-indexed array 

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-1">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header with title and timer */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-2xl font-bold">Assessment in Progress</div>
          <TestTimer initialTime={TEST_DURATION} onTimeUp={handleTimeUp} />
        </div>

        {/* Progress tracker */}
        <ProgressTracker
          currentQuestion={currentQuestion}
          totalQuestions={questions.length}
          answeredCount={answeredCount}
        />

        {/* Question card */}
        <div className="flex flex-row justify-center items-start gap-2">
          <QuestionCard
            questionNumber={currentQuestion}
            totalQuestions={questions.length}
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
            totalQuestions={questions.length}
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
        totalQuestions={questions.length}
        answeredCount={answeredCount}
      />

      {/* Results Dialog */}
      <ResultDialog
        isOpen={showResultDialog}
        onOpenChange={setShowResultDialog}
        onReturn={() => router.push('/dashboard')}
        // score={score}
        // totalQuestions={testQuestions.length}
        // timeTaken={timeTaken}
      />
    </main>
  );
};

export default MainExam;
