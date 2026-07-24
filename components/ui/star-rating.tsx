'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  maxStars?: number
  interactive?: boolean
  onRate?: (rating: number) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-5 h-5' }

export function StarRating({ rating, maxStars = 5, interactive = false, onRate, disabled = false, size = 'sm' }: StarRatingProps) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex gap-0.5" dir="ltr">
      {Array.from({ length: maxStars }, (_, i) => i + 1).map((star) => {
        const filled = interactive ? star <= (hovered || rating) : star <= rating
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive || disabled}
            onClick={() => interactive && !disabled && onRate?.(star)}
            onMouseEnter={() => interactive && !disabled && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            className={cn(
              'transition-transform',
              interactive && !disabled && 'cursor-pointer hover:scale-110',
              (!interactive || disabled) && 'cursor-default'
            )}
          >
            <Star
              className={cn(
                sizes[size],
                filled ? 'fill-accent text-accent' : 'fill-none text-gray-300'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
