'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, MapPin, Clock, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useDebounce } from '@/hooks/use-debounce'
import type { City, Neighborhood, Category } from '@/types'

const SEARCH_HISTORY_KEY = 'search_history'
const MAX_HISTORY = 5

interface SearchBarProps {
  initalCities: City[]
  initalCategories: Category[]
}

function getSearchHistory(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]')
  } catch {
    return []
  }
}

function addToSearchHistory(term: string) {
  if (!term.trim()) return
  const history = getSearchHistory()
  const filtered = history.filter((h) => h !== term)
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify([term, ...filtered].slice(0, MAX_HISTORY)))
}

export default function SearchBar({ initalCities, initalCategories }: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [cityId, setCityId] = useState(searchParams.get('city_id') || '')
  const [category_id, setCategoryId] = useState(searchParams.get('category_id') || '')
  const [neighborhoodId, setNeighborhoodId] = useState(searchParams.get('neighborhood_id') || '')
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const searchRef = useRef<HTMLInputElement>(null)

  const debouncedSearch = useDebounce(search, 300)

  const neighborhoods: Neighborhood[] = cityId
    ? initalCities.find((c: City) => c.id === Number(cityId))?.neighborhoods || []
    : []

  useEffect(() => setHistory(getSearchHistory()), [])

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const params = new URLSearchParams()
    if (debouncedSearch.trim()) { params.set('search', debouncedSearch.trim()); addToSearchHistory(debouncedSearch.trim()) }
    if (cityId) params.set('city_id', cityId)
      if(category_id) params.set('category_id', category_id)
    if (neighborhoodId) params.set('neighborhood_id', neighborhoodId)
    params.set('status', 'public')
    setShowHistory(false)
    setHistory(getSearchHistory())
    router.push(`/projects?${params.toString()}`)
  }

  const handleHistoryClick = (term: string) => {
    setSearch(term)
    setShowHistory(false)
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.5, ease: 'easeOut' }}
      className="relative z-30 w-full max-w-5xl mx-auto"
    >
      {/* Glowing ring behind the card */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-accent/50 via-white/20 to-primary/40 blur-sm pointer-events-none" />

      {/* Card */}
      <div className="relative overflow-visible bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/60 p-2">
        <div className="flex flex-col sm:flex-row gap-2">

          {/* Category select */}
          <div className="flex items-center gap-2.5 px-3 py-2.5 bg-primary/5 hover:bg-primary/10 rounded-xl sm:w-44 shrink-0 border border-primary/10 transition-colors">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <select
              value={category_id}
              onChange={(e) => { setCategoryId(e.target.value); setNeighborhoodId('') }}
              className="bg-transparent text-sm text-gray-700 outline-none w-full cursor-pointer font-medium"
            >
              <option value="">التصنيف</option>
              {initalCategories.map((category: Category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          {/* City select */}
          <div className="flex items-center gap-2.5 px-3 py-2.5 bg-primary/5 hover:bg-primary/10 rounded-xl sm:w-44 shrink-0 border border-primary/10 transition-colors">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <select
              value={cityId}
              onChange={(e) => { setCityId(e.target.value); setNeighborhoodId('') }}
              className="bg-transparent text-sm text-gray-700 outline-none w-full cursor-pointer font-medium"
            >
              <option value="">المحافظة</option>
              {initalCities.map((city: City) => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px self-stretch bg-gray-100 my-1" />

          {/* Neighborhood select */}
          <div className="flex items-center gap-2.5 px-3 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl sm:w-40 shrink-0 border border-gray-100 transition-colors">
            <MapPin className="w-4 h-4 text-gray-300 shrink-0" />
            <select
              value={neighborhoodId}
              onChange={(e) => setNeighborhoodId(e.target.value)}
              className="bg-transparent text-sm text-gray-600 outline-none w-full cursor-pointer"
              disabled={!cityId || neighborhoods.length === 0}
            >
              <option value="">الحي / المنطقة</option>
              {neighborhoods.map((n: Neighborhood) => (
                <option key={n.id} value={n.id}>{n.name}</option>
              ))}
            </select>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px self-stretch bg-gray-100 my-1" />

          {/* Search input */}
          <div className="relative z-30 flex-1">
            <Search className="absolute top-1/2 end-3.5 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => { if (history.length > 0) setShowHistory(true) }}
              onBlur={() => setTimeout(() => setShowHistory(false), 200)}
              placeholder="عن ماذا تبحث؟ صيدلية، مطعم، ميكانيك..."
              className="w-full px-4 pe-10 py-2.5 bg-transparent rounded-xl text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:bg-gray-50 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute top-1/2 start-3 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* History dropdown */}
            {showHistory && history.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full mt-2 end-0 start-0 z-50 bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden"
              >
                <p className="text-xs text-gray-400 px-3 py-1.5 flex items-center gap-1.5 border-b border-gray-50">
                  <Clock className="w-3 h-3" />
                  عمليات البحث الأخيرة
                </p>
                {history.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onMouseDown={() => handleHistoryClick(term)}
                    className="w-full text-right px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <Clock className="w-3 h-3 text-gray-300 shrink-0" />
                    {term}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-gradient-to-l from-primary to-primary/85 hover:from-primary/90 hover:to-primary text-white font-bold text-sm px-7 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg shrink-0 hover:scale-[1.02] active:scale-95"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">بحث الآن</span>
          </button>
        </div>
      </div>
    </motion.form>
  )
}
