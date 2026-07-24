'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Option {
  value: string | number
  label: string
}

interface SearchableSelectProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  remoteSearch?: boolean
  onSearchChange?: (search: string) => void
  hasMore?: boolean
  isLoadingMore?: boolean
  onLoadMore?: () => void
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'اختر...',
  className,
  disabled,
  remoteSearch = false,
  onSearchChange,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => String(o.value) === value)
  const filtered = remoteSearch
    ? options
    : options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (!open || !hasMore || !onLoadMore || isLoadingMore) return

    const el = loadMoreRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onLoadMore()
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [open, hasMore, isLoadingMore, onLoadMore, filtered.length])

  const handleSearchChange = (next: string) => {
    setSearch(next)
    onSearchChange?.(next)
  }

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((p) => !p)}
        className={cn(
          'w-full flex items-center justify-between border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white outline-none transition-colors text-start',
          open ? 'border-primary' : 'hover:border-gray-300',
          disabled && 'opacity-50 cursor-not-allowed',
          !selected && 'text-gray-400'
        )}
      >
        <span className="truncate">{selected?.label || placeholder}</span>
        <div className="flex items-center gap-1 shrink-0 ms-2">
          {value && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(''); setSearch(''); onSearchChange?.('') }}
              className="text-gray-300 hover:text-gray-500 p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform', open && 'rotate-180')} />
        </div>
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-modal overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute top-1/2 end-2.5 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                autoFocus
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="بحث..."
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 pe-8 outline-none focus:border-primary"
              />
            </div>
          </div>
          <ul className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-400 text-center">لا توجد نتائج</li>
            ) : (
              filtered.map((o) => (
                <li key={o.value}>
                  <button
                    type="button"
                    onClick={() => { onChange(String(o.value)); setOpen(false); setSearch(''); onSearchChange?.('') }}
                    className={cn(
                      'w-full text-start px-3 py-2 text-sm hover:bg-gray-50 transition-colors',
                      String(o.value) === value ? 'text-primary font-semibold bg-primary/5' : 'text-gray-700'
                    )}
                  >
                    {o.label}
                  </button>
                </li>
              ))
            )}
            {(hasMore || isLoadingMore) && (
              <li>
                <div ref={loadMoreRef} className="flex justify-center py-2">
                  {isLoadingMore && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                </div>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
