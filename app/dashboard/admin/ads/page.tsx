import { Suspense } from "react"
import AdsSkeleton from "@/components/skeleton/ads/AdsSkeleton"
import AdsContent from "@/components/admin/ads/AdsContent"
import { getAdminAds } from "@/lib/admin/server"

export default function AdminVerificationsPage() {
  return <Suspense fallback={<AdsSkeleton />}>
    <AdsContentData />
  </Suspense>
}

async function AdsContentData() {
  const initialData = await getAdminAds()
  return <AdsContent initialData={initialData} />
}