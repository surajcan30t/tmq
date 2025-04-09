"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Clock, BookOpen, Calendar, ArrowRight, LogOut, Phone } from "lucide-react"

// Mock user data
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  role: "Student",
  dob: "12-02-2003",
  avatarUrl: "/placeholder.svg?height=40&width=40",
  completedTests: [
    { id: "test-1", name: "JavaScript Fundamentals", score: 85, date: "2023-03-15", totalQuestions: 20 },
    { id: "test-2", name: "React Basics", score: 92, date: "2023-04-10", totalQuestions: 15 },
  ],
}

//Mocke exam data
const examData = {
  examName: "ODISHA STATE COMPUTING OLYMPIAD (OSCO)"
}

// Mock available tests
const availableTests = [
  {
    id: "test-3",
    name: "OSCO Round T1",
    duration: 30,
    questions: 25,
    level: "Level 1",
  },
  {
    id: "test-4",
    name: "OSBIC Level 1 Round 1 T1",
    duration: 30,
    questions: 30,
    level: "Level 1",
  },
  {
    id: "test-5",
    name: "OSBIC Level 2 Round 1 T1",
    duration: 30,
    questions: 20,
    level: "Level 2",
  },
]

const Dashboard = () => {
  const router = useRouter()

  const handleStartTest = (testId: string) => {
    router.push(`/instructions/${testId}`)
  }

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary">{examData.examName}</h1>

          <div className="flex items-center gap-4">
            <div className="text-sm text-right hidden sm:block">
              <div className="font-medium">{userData.name}</div>
            </div>

            <Avatar className="h-9 w-9">
              <AvatarImage src={userData.avatarUrl} alt={userData.name} />
              <AvatarFallback>
                {userData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <Button variant="destructive" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          {/* Profile Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={userData.avatarUrl} alt={userData.name} />
                    <AvatarFallback className="text-2xl">
                      {userData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="text-center">
                  <h2 className="text-xl font-bold">{userData.name}</h2>
                  <p className="text-muted-foreground">{userData.email}</p>
                </div>

                <div className="pt-2 space-y-3">
                  {/* <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="rounded-full">
                      {userData.role}
                    </Badge>
                  </div> */}

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span><span className="font-semibold">DOB</span> - {userData.dob}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{userData.completedTests.length} Tests Completed</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {/* <Button variant="outline" className="w-full">
                  Edit Profile
                </Button> */}
              </CardFooter>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <Tabs defaultValue="available" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Your Tests</h2>
                <TabsList>
                  <TabsTrigger value="available">Available Tests</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="available" className="space-y-4">
                {availableTests.map((test) => (
                  <Card key={test.id} className="overflow-hidden">
                    <div className="grid md:grid-cols-[1fr_auto] items-center">
                      <div>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle>{test.name}</CardTitle>
                            <Badge className="ml-2 bg-violet-800 font-bold">{test.level}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{test.duration} minutes</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4 text-muted-foreground" />
                              <span>{test.questions} questions</span>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                      <div className="p-6">
                        <Button variant={'trident'} onClick={() => handleStartTest(test.id)} className="gap-2">
                          Start Test
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard