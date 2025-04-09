"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const Instructions = ({testId}:{testId: string}) => {
  const router = useRouter()
  const [agreed, setAgreed] = useState(false)
  console.log('instruction page:: testid-', testId)

  const handleProceed = () => {
    if (agreed) {
      router.push(`/exam/${testId}`)
    }
  }
  return (
    <div>
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Test Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Welcome to the Assessment</h3>
            <p>Please read the following instructions carefully before proceeding:</p>

            <div className="space-y-2">
              <h4 className="font-medium">Test Duration</h4>
              <p>You will have 60 minutes to complete this test. A timer will be displayed on the screen.</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Question Format</h4>
              <p>The test consists of multiple-choice questions. Each question has only one correct answer.</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Navigation</h4>
              <p>
                You can navigate between questions using the Next and Previous buttons. You can also review your answers
                before submitting.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Submission</h4>
              <p>
                Once you have completed all questions, click the Submit button to finish the test. You cannot change
                your answers after submission.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Technical Issues</h4>
              <p>
                If you encounter any technical issues during the test, please contact the administrator immediately.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-2 pt-4">
            <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
            <Label htmlFor="terms" className="text-sm font-normal">
              I have read and understood the instructions, and I agree to proceed with the test.
            </Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant={"trident"} onClick={handleProceed} disabled={!agreed} className="w-full">
            Proceed to Test
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Instructions