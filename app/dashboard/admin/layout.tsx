import { DashboardNavBar } from '@/components/layout/dashboard/nav-bar'
import { getSession } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardNavBar variant="admin" user={user} />
      <main className="flex-1 overflow-y-auto h-full">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
