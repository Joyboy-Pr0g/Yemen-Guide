import { Suspense } from 'react'
import { getCategories } from '@/lib/server-api'
import { CategoryCard, CategoryCardSkeleton } from '@/components/categories/category-card'
import type { Category } from '@/types'

const title = 'تصنيفات الأعمال والخدمات | دُّلني-اليمن'
const description = 'تصفح جميع تصنيفات الأنشطة التجارية في دُّلني-اليمن، من المطاعم والصيدليات إلى العقارات والسيارات والتعليم والخدمات المتنوعة.'

export const metadata = {
  title,
  description,
  alternates: { canonical: '/categories' },
  openGraph: { title, description, url: '/categories' },
  twitter: { card: 'summary_large_image' as const, title, description },
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => <CategoryCardSkeleton key={i} />)}
    </div>}>
      <CategoriesContent />
    </Suspense>
  )
}

const CategoriesContent = async () => {
  let categories: Awaited<ReturnType<typeof getCategories>> = []
  try {
    categories = await getCategories()
  } catch { }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">التصنيفات</h1>
        <p className="text-gray-400 mt-1">تصفح جميع تصنيفات الأعمال والخدمات</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {categories.map((cat: Category) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  )
}
