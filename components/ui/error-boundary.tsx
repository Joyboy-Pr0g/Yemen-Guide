'use client'

import { Component, type ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex flex-col items-center justify-center p-6 text-center text-gray-400">
          <AlertCircle className="w-8 h-8 mb-2 text-gray-300" />
          <p className="text-sm">حدث خطأ في تحميل هذا القسم</p>
        </div>
      )
    }
    return this.props.children
  }
}
