import { Suspense } from "react"
import CategoriesContent from "@/components/admin/categories/CategoriesContent"
import { getAdminCategories } from "@/lib/admin/server"
import { Skeleton } from "@/components/ui/skeleton"


export default function AdminVerificationsPage() {
  return <Suspense fallback={<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
    {Array.from({ length: 12 }).map((_, i) => (
      <Skeleton key={i} className="h-4 w-32" />
    ))}
  </div>}>
    <CategoriesContentData />
  </Suspense>
}

async function CategoriesContentData() {
  const initialCategories = await getAdminCategories()
  return <CategoriesContent initialCategories={initialCategories} />
}