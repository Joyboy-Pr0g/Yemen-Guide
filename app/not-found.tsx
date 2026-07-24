import Link from 'next/link'
import { MapPin, Home, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="relative mb-8">
          <div className="text-[120px] font-black text-primary/8 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
              <MapPin className="w-10 h-10 text-primary" />
            </div>
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-3">الصفحة غير موجودة</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى عنوان آخر.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            <Home className="w-4 h-4" />
            العودة للرئيسية
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            تصفح الأعمال
            <ArrowRight className="w-4 h-4 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  )
}
