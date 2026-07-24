import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { getSession } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

export default async function MeLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()

  return (
    <>
      <Navbar user={user} />
      <main className="min-h-screen bg-background">{children}</main>
      <Footer />
    </>
  )
}
