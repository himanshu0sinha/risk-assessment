import { useState } from 'react'
import { Star } from 'lucide-react'

interface StarRatingProps {
  max: number
  value: number
  onChange: (value: number) => void
}

export function StarRating({ max, value, onChange }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0)

  return (
    <div className="flex">
      {[...Array(max)].map((_, index) => {
        const starValue = index + 1
        return (
          <Star
            key={index}
            className={`w-8 h-8 cursor-pointer ${
              (hoverValue || value) >= starValue ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
            onMouseEnter={() => setHoverValue(starValue)}
            onMouseLeave={() => setHoverValue(0)}
            onClick={() => onChange(starValue)}
          />
        )
      })}
    </div>
  )
}
