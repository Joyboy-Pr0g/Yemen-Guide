import Link from 'next/link'
import { CategoryCard, CategoryCardSkeleton } from '@/components/categories/category-card'
import { ScrollAnimation } from '@/components/Home/ScrollAnimation'
import type { Category } from '@/types'

interface CategoriesSectionProps {
  cats: Category[]
}

export function CategoriesSection({ cats }: CategoriesSectionProps) {
  return (
    <section className="mt-14">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">تصفح حسب التصنيف</h2>
          <p className="text-sm text-gray-400 mt-1">اختر تصنيفاً للعثور على ما تريد</p>
        </div>
        <Link href="/categories" className="text-sm font-semibold text-primary hover:underline">
          عرض الكل
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {cats.length > 0
          ? cats.slice(0, 12).map((cat, index) => (
              <ScrollAnimation key={cat.id} index={index}>
                <CategoryCard category={cat} />
              </ScrollAnimation>
            ))
          : Array.from({ length: 12 }).map((_, i) => <CategoryCardSkeleton key={i} />)}
      </div>
    </section>
  )
}
