'use client'

import { useState } from 'react'
import { CirclePlay, Loader2 } from 'lucide-react'
import { useVisual } from '@/hooks/use-visual'
import { VideoModal } from '@/components/ui/video-modal'
import type { VisualKey } from '@/types'

interface TutorialVideoButtonProps {
  visualKey: VisualKey
  label?: string
}

export function TutorialVideoButton({ visualKey, label = 'شاهد الفيديو التعليمي' }: TutorialVideoButtonProps) {
  const [open, setOpen] = useState(false)
  const { data: visual, isLoading, isError } = useVisual(visualKey)

  if (isLoading) {
    return (
      <button type="button" disabled className="flex items-center gap-2 text-sm text-gray-400 border border-gray-200 rounded-xl px-4 py-2.5">
        <Loader2 className="w-4 h-4 animate-spin" />
        جاري التحميل...
      </button>
    )
  }

  if (isError || !visual?.video_url) {
    return null
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm font-semibold text-primary border border-primary/20 bg-primary/5 hover:bg-primary/10 rounded-xl px-4 py-2.5 transition-colors"
      >
        <CirclePlay className="w-4 h-4" />
        {label}
      </button>

      <VideoModal
        open={open}
        title={visual.name}
        videoUrl={visual.video_url}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
