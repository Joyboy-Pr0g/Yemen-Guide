import VerificationsContent from "@/components/admin/verifications/VerificationsContent"
import { getAdminVerifications } from "@/lib/admin/server"
import { Suspense } from "react"
import VerificationsSkeleton from "@/components/skeleton/verification/VerificationsSkeleton"


export default function AdminVerificationsPage() {
  return <Suspense fallback={<VerificationsSkeleton />}>
    <VerificationContentData />
  </Suspense>
}

async function VerificationContentData() {
  const initialData = await getAdminVerifications()
  return <VerificationsContent initialData={initialData} />
}
