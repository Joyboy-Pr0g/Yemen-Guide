'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Grid3X3, X, ChevronLeft, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'
import { FaIcon } from '@/components/ui/fa-icon'
import type { Category } from '@/types'

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  const handleClick = () => {
    if (category.sub_categories && category.sub_categories.length > 0) {
      setShowModal(true)
    } else {
      router.push(`/projects?category_id=${category.id}`)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        whileHover={{ y: -3, scale: 1.02 }}
        transition={{ duration: 0.15 }}
        onClick={handleClick}
        className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover transition-all cursor-pointer overflow-hidden group"
      >
        <div className="p-5">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-primary/8 group-hover:bg-primary transition-colors">
            <FaIcon
              icon={category.icon}
              className="w-5 h-5 text-primary group-hover:text-white transition-colors"
              fallback={<Grid3X3 className="w-5 h-5 text-primary group-hover:text-white transition-colors" />}
            />
          </div>

          <h3 className="font-bold text-sm mb-1 text-gray-800 group-hover:text-primary transition-colors">
            {category.name}
          </h3>

          {category.sub_categories && (
            <p className="text-xs text-gray-400">
              {category.sub_categories.length} تصنيف فرعي
            </p>
          )}
        </div>
      </motion.div>

      {/* Subcategories Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-modal w-full max-w-lg overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <FaIcon
                      icon={category.icon}
                      className="w-5 h-5 text-primary"
                      fallback={<Grid3X3 className="w-5 h-5 text-primary" />}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{category.name}</h3>
                    <p className="text-xs text-gray-400">{category.sub_categories?.length || 0} تصنيف فرعي</p>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Subcategories grid */}
              <div className="p-5 grid grid-cols-2 gap-2 max-h-72 overflow-y-auto">
                {category.sub_categories?.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => { setShowModal(false); router.push(`/projects?sub_category_id=${sub.id}`) }}
                    className="flex items-center justify-between py-2.5 px-3.5 bg-gray-50 hover:bg-primary/8 hover:text-primary rounded-xl text-sm text-gray-700 text-right transition-colors group/sub"
                  >
                    <span>{sub.name}</span>
                    <ChevronLeft className="w-3.5 h-3.5 text-gray-300 group-hover/sub:text-primary transition-colors" />
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t border-gray-100 flex gap-2">
                <button
                  onClick={() => { setShowModal(false); router.push(`/projects?category_id=${category.id}`) }}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  عرض جميع نشاطات {category.name}
                </button>
                <button onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  إغلاق
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function CategoryCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <Skeleton className="w-12 h-12 rounded-xl mb-3" />
      <Skeleton className="h-4 w-2/3 mb-2" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  )
}
