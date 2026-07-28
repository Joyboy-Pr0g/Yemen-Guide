'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

const ease = [0.22, 1, 0.36, 1] as const

interface ScrollAnimationProps {
  children: ReactNode
  className?: string
  index?: number
}

export function ScrollAnimation({ children, className, index = 0 }: ScrollAnimationProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.45, ease, delay: index * 0.06 }}
    >
      {children}
    </motion.div>
  )
}

export function ScrollFadeIn({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease }}
    >
      {children}
    </motion.div>
  )
}
