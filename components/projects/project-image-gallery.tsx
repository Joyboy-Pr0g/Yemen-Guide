'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Zap } from 'lucide-react'
import { getImageUrl } from '@/lib/utils'
import { ProjectFeaturedImage } from '@/types'

const BLUR =
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k='

interface GalleryImage {
    key: string
    src: string
}

interface ProjectImageGalleryProps {
    name: string
    mainImage: string
    featuredImages?: ProjectFeaturedImage[]
    isFeatured?: boolean
}

export default function ProjectImageGallery({
    name,
    mainImage,
    featuredImages = [],
    isFeatured,
}: ProjectImageGalleryProps) {
    const images = useMemo<GalleryImage[]>(() => {
        const sorted = [...featuredImages].sort((a, b) => a.sort_order - b.sort_order)
        return [
            { key: 'main', src: mainImage },
            ...sorted.map((item) => ({ key: String(item.id), src: item.image })),
        ]
    }, [mainImage, featuredImages])

    const [activeKey, setActiveKey] = useState('main')

    const activeImage = images.find((img) => img.key === activeKey)?.src ?? mainImage

    if (images.length <= 1) {
        return (
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100">
                <Image
                    src={getImageUrl(mainImage)}
                    alt={name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    placeholder="blur"
                    blurDataURL={BLUR}
                />
                {isFeatured && (
                    <span className="absolute top-3 start-3 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        نشاط مميز
                    </span>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-3">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100">
                <Image
                    src={getImageUrl(activeImage)}
                    alt={name}
                    fill
                    className="object-cover"
                    priority={activeKey === 'main'}
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    placeholder="blur"
                    blurDataURL={BLUR}
                />
                {isFeatured && (
                    <span className="absolute top-3 start-3 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        نشاط مميز
                    </span>
                )}
            </div>

            <div className="flex flex-wrap gap-2">
                {images.map((item, index) => {
                    const isActive = item.key === activeKey
                    return (
                        <button
                            key={item.key}
                            type="button"
                            onClick={() => setActiveKey(item.key)}
                            aria-label={`${name} - صورة ${index + 1}`}
                            aria-pressed={isActive}
                            className={`relative w-[calc(50%-4px)] sm:w-[calc(25%-6px)] aspect-video rounded-xl overflow-hidden bg-gray-100 border-2 transition-colors cursor-pointer ${
                                isActive ? 'border-primary ring-2 ring-primary/20' : 'border-gray-100 hover:border-gray-200'
                            }`}
                        >
                            <Image
                                src={getImageUrl(item.src)}
                                alt={`${name} - صورة ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 50vw, 25vw"
                            />
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
