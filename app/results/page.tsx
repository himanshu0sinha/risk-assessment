import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

async function getResults(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/results/${id}`, { cache: 'no-store' })
    if (!res.ok) {
      if (res.status === 404) {
        return notFound()
      }
      throw new Error('Failed to fetch results')
    }
    return res.json()
  } catch (error) {
    console.error('Error fetching results:', error)
    return null
  }
}

export default async function ResultsPage({ searchParams }: { searchParams: { id: string } }) {
  const { id } = searchParams
  const results = await getResults(id)

  if (!results) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-3xl bg-white bg-opacity-90 backdrop-blur-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-center">Unable to retrieve your results. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div
        className="w-full max-w-3xl"
      >
        <Card className="bg-white bg-opacity-90 backdrop-blur-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Your Financial Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-2">Risk Profile</h2>
                <p className="text-lg">{results.riskProfile}</p>
              </section>
              <section>
                <h2 className="text-2xl font-semibold mb-2">Savings Habits</h2>
                <p className="text-lg">{results.savingsHabits}</p>
              </section>
              <section>
                <h2 className="text-2xl font-semibold mb-2">Investment Strategy</h2>
                <p className="text-lg">{results.investmentStrategy}</p>
              </section>
              <section>
                <h2 className="text-2xl font-semibold mb-2">Debt Management</h2>
                <p className="text-lg">{results.debtManagement}</p>
              </section>
              <section>
                <h2 className="text-2xl font-semibold mb-2">Recommendations</h2>
                <ul className="list-disc list-inside text-lg">
                  {results.recommendations.map((recommendation: string, index: number) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
