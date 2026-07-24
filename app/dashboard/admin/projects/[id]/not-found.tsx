import Link from 'next/link'
import { Store, Home } from 'lucide-react'

export default function ProjectNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Store className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">النشاط غير موجود</h1>
        <p className="text-gray-400 text-sm mb-6">ربما تم حذف هذا النشاط أو تغيير رابطه.</p>
        <Link href="/projects" className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors">
          <Home className="w-4 h-4" />
          تصفح الأعمال
        </Link>
      </div>
    </div>
  )
}
