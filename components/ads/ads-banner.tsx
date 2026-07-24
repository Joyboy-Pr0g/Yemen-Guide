import Image from 'next/image'
import { getImageUrl } from '@/lib/utils'
import type { Ad } from '@/types'

interface AdsBannerProps {
  ads: Ad[]
  columns?: number
}

export function AdsBanner({ ads, columns = 3 }: AdsBannerProps) {
  if (!ads || ads.length === 0) return null

  // Map grid_cols (1-4) to 12-column span: 1→3, 2→6, 3→9, 4→12
  const getSpan = (gridCols: number) => {
    const colMap: Record<number, number> = { 1: 3, 2: 6, 3: 9, 4: 12 }
    return colMap[gridCols] ?? 12
  }

  return (
    <div className="grid grid-cols-12 gap-3 my-6">
      {ads.map((ad) => (
        <div
          key={ad.id}
          className="relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-card"
          style={{ gridColumn: `span ${getSpan(ad.grid_cols)}` }}
        >
          {ad.link_url ? (
            <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="block">
              <AdContent ad={ad} />
            </a>
          ) : (
            <AdContent ad={ad} />
          )}
          <span className="absolute top-2 end-2 bg-black/40 text-white text-[9px] font-medium px-1.5 py-0.5 rounded-full backdrop-blur-sm">
            إعلان
          </span>
        </div>
      ))}
    </div>
  )
}

function AdContent({ ad }: { ad: Ad }) {
  return (
    <div className="relative h-24 sm:h-32">
      <Image
        src={getImageUrl(ad.image)}
        alt={ad.title}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      <span className="absolute bottom-3 end-3 text-white font-semibold text-sm drop-shadow">{ad.title}</span>
    </div>
  )
}

export function AdsBannerSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-3 my-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="col-span-4 h-24 sm:h-32 rounded-2xl bg-gray-200 animate-pulse" />
      ))}
    </div>
  )
}
