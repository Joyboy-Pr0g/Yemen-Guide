'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectsFilterBar from './ProjectFilterBar'
import { LayoutGrid, List, Map, MapPin, SlidersHorizontal, Search } from 'lucide-react'
import { getImageUrl } from '@/lib/utils'
import { useInfiniteProjects, useMapAreaProjects } from '@/hooks/use-projects'
import { useCurrentUser } from '@/hooks/use-auth'
import { useDebounce } from '@/hooks/use-debounce'
import ProjectCardSkeleton, { ProjectCardSkeletonItem } from '@/components/skeleton/project/ProjectCardSkeleton'
import type { City, Category, Ad, PaginatedMeta, Project, ProjectFilters } from '@/types'
import { PublicProjectCard } from './public-project-card'
import { boundsEqual, boundsToParams, type MapBounds } from '@/utils/mapBounds'
import { cn } from '@/lib/utils'

const ProjectsMapSearch = dynamic(() => import('./projects-map-search'), {
  ssr: false,
  loading: () => <div className="h-full min-h-[320px] bg-gray-100 animate-pulse rounded-2xl" />,
})

export type ProjectsViewMode = 'list' | 'split' | 'map'

interface PublicProjectsPageContentProps {
  projectsWithMeta: { projects: Project[]; meta: PaginatedMeta }
  initialParams: Record<string, string | undefined>
  cities: City[]
  categories: Category[]
  sidebarAds: Ad[]
  defaultViewMode?: ProjectsViewMode
  pageTitle?: string
}

function parseInitialBounds(params: Record<string, string | undefined>): MapBounds | null {
  const { lat_min, lat_max, lng_min, lng_max } = params
  if (!lat_min || !lat_max || !lng_min || !lng_max) return null
  const bounds = {
    lat_min: parseFloat(lat_min),
    lat_max: parseFloat(lat_max),
    lng_min: parseFloat(lng_min),
    lng_max: parseFloat(lng_max),
  }
  if (Object.values(bounds).some((n) => Number.isNaN(n))) return null
  return bounds
}

export default function PublicProjectsPageContent({
  projectsWithMeta,
  initialParams: params,
  cities,
  categories,
  sidebarAds,
  defaultViewMode = 'list',
  pageTitle = 'دليل الأعمال',
}: PublicProjectsPageContentProps) {
  const [search, setSearch] = useState(params.search ?? '')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<ProjectsViewMode>(defaultViewMode)
  const [mapReady, setMapReady] = useState(false)
  const [filters, setFilters] = useState<ProjectFilters>({
    city_id: params.city_id ?? '',
    neighborhood_id: params.neighborhood_id ?? '',
    category_id: params.category_id ?? '',
    sub_category_id: params.sub_category_id ?? '',
  })
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(() => parseInitialBounds(params))
  const [pendingBounds, setPendingBounds] = useState<MapBounds | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const autoSearchedRef = useRef(false)

  const { data: user } = useCurrentUser()
  const isVisitor = !!user && user.role === 'visitor'
  const debouncedSearch = useDebounce(search, 300)

  const queryFilters = useMemo(() => ({
    search: debouncedSearch,
    city_id: filters.city_id,
    neighborhood_id: filters.neighborhood_id,
    category_id: filters.category_id,
    sub_category_id: filters.sub_category_id,
    ...(mapBounds ? { ...boundsToParams(mapBounds), per_page: 100 } : {}),
  }), [debouncedSearch, filters, mapBounds])

  const showMap = viewMode === 'split' || viewMode === 'map'
  const showList = viewMode === 'split' || viewMode === 'list'

  const {
    data,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteProjects(projectsWithMeta, queryFilters, params)

  const mapAreaFilters = useMemo(() => ({
    search: debouncedSearch,
    city_id: filters.city_id,
    neighborhood_id: filters.neighborhood_id,
    category_id: filters.category_id,
    sub_category_id: filters.sub_category_id,
    ...(mapBounds ? boundsToParams(mapBounds) : {}),
  }), [debouncedSearch, filters, mapBounds])

  const {
    data: mapAreaData,
    isFetching: isMapFetching,
    refetch: refetchMapArea,
  } = useMapAreaProjects(mapAreaFilters, showMap && mapReady && !!mapBounds)

  const allProjects = useMemo(
    () => data?.pages.flatMap((page) => page.projects) ?? [],
    [data?.pages],
  )
  const mapProjects = useMemo(() => {
    if (!mapBounds) return []
    return (mapAreaData?.projects ?? [])
      .filter((p) => p.latitude && p.longitude)
  }, [mapBounds, mapAreaData?.projects])
  const total = data?.pages[0]?.meta.total ?? 0
  const isPersonalized = isVisitor && (data?.pages[0]?.meta.personalized ?? false)
  const isLoadingList = isFetching && !isFetchingNextPage
  const areaSearchPending = pendingBounds !== null && !boundsEqual(pendingBounds, mapBounds)
  const allowInfiniteScroll = viewMode === 'list'

  useEffect(() => {
    if (!showMap) {
      setMapReady(false)
      autoSearchedRef.current = false
      setMapBounds(null)
      setPendingBounds(null)
      return
    }

    const timer = window.setTimeout(() => setMapReady(true), 300)
    return () => window.clearTimeout(timer)
  }, [showMap])

  const resetFilters = () => {
    setFilters({
      city_id: '',
      neighborhood_id: '',
      category_id: '',
      sub_category_id: '',
    })
    setSearch('')
    setMapBounds(null)
    setPendingBounds(null)
    setShowFilters(false)
  }

  const handleBoundsChange = useCallback((bounds: MapBounds) => {
    setPendingBounds((current) => (boundsEqual(current, bounds) ? current : bounds))
  }, [])

  const handleSearchArea = () => {
    if (!pendingBounds) return
    setMapBounds(pendingBounds)
    if (boundsEqual(pendingBounds, mapBounds)) {
      void refetchMapArea()
    }
  }

  useEffect(() => {
    if (!mapReady || !showMap || !pendingBounds || autoSearchedRef.current) return
    autoSearchedRef.current = true
    setMapBounds(pendingBounds)
  }, [mapReady, showMap, pendingBounds])

  useEffect(() => {
    autoSearchedRef.current = false
    setMapBounds(null)
    setPendingBounds(null)
  }, [debouncedSearch, filters.city_id, filters.neighborhood_id, filters.category_id, filters.sub_category_id])

  useEffect(() => {
    if (!allowInfiniteScroll || !hasNextPage || isFetchingNextPage || isLoadingList || !showList) return

    const el = loadMoreRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage()
      },
      { threshold: 0.1, rootMargin: '200px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [allowInfiniteScroll, hasNextPage, isFetchingNextPage, isLoadingList, fetchNextPage, allProjects.length, showList])

  const listSection = (
    <div
      className={cn('min-w-0', showMap && viewMode === 'split' && 'lg:max-h-[calc(100vh-11rem)] lg:overflow-y-auto lg:pe-1')}
    >
      {isLoadingList ? (
        <ProjectCardSkeleton count={showMap ? 4 : 8} variant="public" />
      ) : allProjects.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <MapPin className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium">لا توجد نتائج</p>
          <p className="text-sm mt-1">جرّب تغيير معايير البحث أو المنطقة على الخريطة</p>
        </div>
      ) : (
        <>
          <div className={cn(
            'grid gap-5',
            showMap && viewMode === 'split'
              ? 'grid-cols-1'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
          )}>
            {allProjects.map((project) => (
              <PublicProjectCard key={project.id} project={project} pathStatus="projects" />
            ))}
            {isFetchingNextPage &&
              Array.from({ length: 3 }).map((_, index) => (
                <ProjectCardSkeletonItem key={`loading-${index}`} variant="public" />
              ))}
          </div>
          <div ref={loadMoreRef} className="h-1 w-full" aria-hidden />
        </>
      )}
    </div>
  )

  const mapSection = showMap ? (
    <div className={cn(
      'relative rounded-2xl overflow-hidden border border-gray-100 shadow-card bg-gray-50 isolate',
      viewMode === 'map' ? 'h-[min(65vh,560px)] min-h-[320px]' : 'h-[280px] sm:h-[360px] lg:h-[min(calc(100vh-12rem),600px)] lg:min-h-[360px] lg:sticky lg:top-24',
    )}>
      {mapReady ? (
        <ProjectsMapSearch
          projects={mapProjects}
          onBoundsChange={handleBoundsChange}
        />
      ) : (
        <div className="h-full bg-gray-100 animate-pulse" />
      )}
      {isMapFetching && (
        <div className="absolute inset-0 z-[400] bg-white/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
          <span className="text-xs font-medium text-gray-600 bg-white/90 px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
            جاري تحديث النتائج...
          </span>
        </div>
      )}
      {areaSearchPending && (
        <div className="absolute top-3 inset-x-0 z-[500] flex justify-center pointer-events-none">
          <button
            type="button"
            onClick={handleSearchArea}
            className="pointer-events-auto flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow-lg transition-colors"
          >
            <MapPin className="w-4 h-4" />
            بحث في هذه المنطقة
          </button>
        </div>
      )}
    </div>
  ) : null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
          {/* {total > 0 && (
            <p className="text-sm text-gray-400 mt-0.5">{total.toLocaleString()} نشاط</p>
          )} */}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-xl border border-gray-200 p-1 bg-white">
            {([
              { mode: 'list' as const, icon: List, label: 'قائمة' },
              { mode: 'split' as const, icon: LayoutGrid, label: 'قائمة + خريطة' },
              { mode: 'map' as const, icon: Map, label: 'خريطة' },
            ]).map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={cn(
                  'flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3 py-2 rounded-lg transition-colors',
                  viewMode === mode ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary',
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl px-4 py-2 hover:border-primary hover:text-primary transition-colors bg-white"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {showFilters ? 'إغلاق' : 'الفلاتر'}
          </button>
          {showFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm font-medium text-gray-600 border border-gray-200 rounded-xl px-4 py-2 hover:border-primary hover:text-primary transition-colors bg-white"
            >
              إعادة التعيين
            </button>
          )}
        </div>
      </div>

      {isPersonalized && (
        <div className="mb-4 p-3 bg-primary/5 text-primary rounded-xl border border-primary/15 text-sm">
          نتائج مخصّصة بناءً على اهتماماتك
        </div>
      )}

      <div className="relative mb-4">
        <Search className="absolute top-1/2 end-3.5 -translate-y-1/2 w-4 h-4 text-gray-300" />
        <input
          type="text"
          placeholder="ابحث عن نشاط تجاري..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 pe-10 py-2.5 text-sm outline-none focus:border-primary bg-white shadow-sm"
        />
      </div>

      {showFilters && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="mb-4"
          >
            <ProjectsFilterBar
              filters={filters}
              setFilters={setFilters}
              cities={cities}
              categories={categories}
            />
          </motion.div>
        </AnimatePresence>
      )}

      <div className={sidebarAds.length > 0 && viewMode === 'list' ? 'flex gap-6 items-start' : undefined}>
        <div className="flex-1 min-w-0">
          {viewMode === 'split' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
              <div className="order-2 lg:order-1">{mapSection}</div>
              <div className="order-1 lg:order-2">{listSection}</div>
            </div>
          ) : (
            <>
              {showMap && !showList && mapSection}
              {showList && !showMap && listSection}
              {showMap && showList && listSection}
            </>
          )}
        </div>

        {sidebarAds.length > 0 && viewMode === 'list' && (
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="space-y-3 sticky top-24">
              {sidebarAds.map((ad) => (
                <div key={ad.id} className="relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-card">
                  {ad.link_url ? (
                    <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="block">
                      <SidebarAdContent ad={ad} />
                    </a>
                  ) : (
                    <SidebarAdContent ad={ad} />
                  )}
                  <span className="absolute top-2 end-2 bg-black/40 text-white text-[9px] font-medium px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                    إعلان
                  </span>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}

function SidebarAdContent({ ad }: { ad: Ad }) {
  return (
    <div className="relative h-36">
      <img src={getImageUrl(ad.image)} alt={ad.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      <span className="absolute bottom-3 end-3 text-white font-semibold text-sm drop-shadow">{ad.title}</span>
    </div>
  )
}
