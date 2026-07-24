import { getAdminVerification, getAdminVerifications } from '@/lib/admin/server'
import VerificationDetails from '@/components/admin/verifications/VerificationDetails'
import { Suspense } from 'react'
import VerificationDetailsSkeleton from '@/components/skeleton/verification/VerificationDetailsSkeleton'

export default function AdminVerificationPage({ params }: { params: { id: string } }) {
  return <Suspense fallback={<VerificationDetailsSkeleton />}>
    <VerificationContentData params={params} />
  </Suspense>
}

async function VerificationContentData({ params }: { params: { id: string } }) {
  const { id } = await params
  const app = await getAdminVerification(Number(id))
  return <VerificationDetails app={app} />
}
