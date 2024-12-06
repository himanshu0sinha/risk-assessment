import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div
        className="text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">Munshi Ji - Survey</h1>
        <p className="text-xl md:text-2xl mb-8 text-white max-w-2xl mx-auto">
          Munshiji is your one-stop solution for all financial advisory needs. Our goal is to simplify your investment journey with expert guidance, data-driven insights, and real-time portfolio management. Discover insights into your financial habits and get personalized recommendations to improve your financial well-being.
        </p>
        <Link href="/survey">
          <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-100 transition-colors duration-300 text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105">
            Start Survey
          </Button>
        </Link>
      </div>
    </div>
  )
}
