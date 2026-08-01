import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { getSession } from '@/lib/auth/session'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()

  return (
    <>
      <Navbar user={user} />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
