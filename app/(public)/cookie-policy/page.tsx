import LegalPageLayout, { LegalSection } from '@/components/legal/legal-page-layout'

export const metadata = {
    title: 'سياسة ملفات تعريف الارتباط | دُّلني-اليمن',
    description: 'تعرّف على ملفات تعريف الارتباط (الكوكيز) التي يستخدمها دُّلني-اليمن وكيفية التحكم بها.',
    alternates: { canonical: '/cookie-policy' },
}

export default function CookiePolicyPage() {
    return (
        <LegalPageLayout title="سياسة ملفات تعريف الارتباط" lastUpdated="2 يوليو 2026">
            <LegalSection title="ما هي ملفات تعريف الارتباط">
                <p>
                    ملفات تعريف الارتباط (الكوكيز) هي ملفات نصية صغيرة تُحفظ في متصفحك عند زيارة موقع إلكتروني، وتُستخدم
                    عادة لتذكّر تفضيلاتك أو حالة تسجيل دخولك.
                </p>
            </LegalSection>

            <LegalSection title="كيف يستخدم دُّلني-اليمن الكوكيز">
                <p>نستخدم نوعين من الكوكيز على الموقع:</p>
                <ul>
                    <li><strong>كوكيز أساسية وضرورية (auth_token):</strong> للحفاظ على تسجيل دخولك والوصول إلى الصفحات الخاصة بحسابك، مثل المفضلة أو لوحة التاجر.</li>
                    <li><strong>كوكيز Google Analytics (مثل _ga و_gid):</strong> لقياس عدد الزيارات والصفحات الأكثر مشاهدة بشكل مجمّع وغير شخصي، بهدف تحسين الموقع.</li>
                </ul>
                <p>لا نستخدم حالياً أي كوكيز خاصة بالإعلانات.</p>
            </LegalSection>

            <LegalSection title="التحكم بالكوكيز">
                <p>
                    يمكنك حذف أو حظر الكوكيز من إعدادات متصفحك في أي وقت، أو استخدام أدوات مثل{' '}
                    <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        إضافة إيقاف تتبّع Google Analytics
                    </a>
                    . يرجى ملاحظة أن تعطيل كوكيز تسجيل الدخول سيؤدي إلى تسجيل خروجك تلقائياً من حسابك.
                </p>
            </LegalSection>

            <LegalSection title="التغييرات المستقبلية">
                <p>
                    في حال أضفنا مستقبلاً أدوات تحليل أو إعلانات إضافية تستخدم كوكيز جديدة، سيتم تحديث هذه الصفحة لتعكس
                    ذلك بوضوح قبل تفعيلها.
                </p>
            </LegalSection>
        </LegalPageLayout>
    )
}
