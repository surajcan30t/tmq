import Instructions from "../../components/instructions"

const InstructionsPage = async ({
  params,
}: {
  params: Promise<{ testid: string }>
}) => {
  const { testid } = await params

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-zinc-200">
      <Instructions testId = {testid}/>
    </main>
  )
}

export default InstructionsPage
