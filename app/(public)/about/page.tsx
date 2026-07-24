import { AboutContent } from '@/components/Home/AboutContent'

const title = 'من نحن | دُّلني-اليمن'
const description = 'دُّلني-اليمن منصة تجمع الأنشطة التجارية والخدمات في مكان واحد لتسهيل التواصل بين الناس وأصحاب الأعمال في جميع المحافظات اليمنية.'

export const metadata = {
    title,
    description,
    alternates: { canonical: '/about' },
    openGraph: { title, description, url: '/about' },
    twitter: { card: 'summary_large_image' as const, title, description },
}

export default function AboutPage() {
    return <AboutContent />
}
