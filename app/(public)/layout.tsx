import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { getSiteSettings } from '@/lib/server-api'
import { getSession } from '@/lib/auth/session'

export const metadata = async () => {
  const settings = await getSiteSettings()
  return {
    title: settings.site_name,
    description: settings.site_description,
    icons: {
      icon: settings.facebook_url || '/favicon.ico',
    },
  }
}

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
