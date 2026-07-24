import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { getTraderProjects, getTraderVerifications } from '@/lib/trader/server'
import VerificationsContent from '@/components/trader/verifications/verifications-content'
import VerificationsSkeleton from '@/components/skeleton/verification/VerificationsSkeleton'

export default function TraderVerificationsPage() {
  return <Suspense fallback={<VerificationsSkeleton />}>
    <TraderVerificationsPageData />
  </Suspense>
}

async function TraderVerificationsPageData() {
  const [initialVerificationData, initialProjectsData] = await Promise.all([
    getTraderVerifications(1),
    getTraderProjects(1),
  ])
  return <VerificationsContent initialVerificationData={initialVerificationData} initialProjectsData={initialProjectsData} />
}