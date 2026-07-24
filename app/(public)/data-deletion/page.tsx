import LegalPageLayout, { LegalSection } from '@/components/legal/legal-page-layout'
import { getSiteSettings } from '@/lib/server-api'

export const metadata = {
    title: 'طلب حذف البيانات | دُّلني-اليمن',
    description: 'خطوات طلب حذف حسابك وبياناتك من دُّلني-اليمن، بما في ذلك الحسابات المسجّلة عبر Google.',
    alternates: { canonical: '/data-deletion' },
}

export default async function DataDeletionPage() {
    const settings = await getSiteSettings()
    const contactEmail = settings.contact_email ?? 'info@yemenguide.sy'

    return (
        <LegalPageLayout title="طلب حذف البيانات" lastUpdated="2 يوليو 2026">
            <LegalSection title="كيفية طلب حذف بياناتك">
                <p>
                    إذا كنت ترغب في حذف حسابك وجميع بياناتك المرتبطة به من دُّلني-اليمن (بما في ذلك الحسابات التي تم
                    تسجيل الدخول إليها عبر Google)، يرجى إرسال طلب عبر البريد الإلكتروني التالي:
                </p>
                <p>
                    <a href={`mailto:${contactEmail}?subject=${encodeURIComponent('طلب حذف الحساب والبيانات')}`} className="text-primary hover:underline font-semibold">
                        {contactEmail}
                    </a>
                </p>
                <p>يرجى تضمين المعلومات التالية في رسالتك لتسريع معالجة الطلب:</p>
                <ul>
                    <li>الاسم الكامل المسجّل في الحساب.</li>
                    <li>البريد الإلكتروني أو رقم الهاتف المرتبط بالحساب.</li>
                    <li>توضيح إن كان الحساب تم إنشاؤه عبر البريد الإلكتروني مباشرة أو عبر تسجيل الدخول بحساب Google.</li>
                </ul>
            </LegalSection>

            <LegalSection title="ماذا يحدث بعد تقديم الطلب">
                <p>
                    بعد التحقق من هويتك، سيتم حذف حسابك وبياناته الشخصية (بيانات الملف الشخصي، الأنشطة التجارية
                    المرتبطة به، المفضلة، التقييمات، ومستندات التوثيق إن وجدت) خلال 30 يوماً من استلام الطلب. قد
                    نحتفظ ببعض البيانات لفترة إضافية إذا كان ذلك مطلوباً للامتثال لالتزامات قانونية.
                </p>
            </LegalSection>

            <LegalSection title="لمزيد من المعلومات">
                <p>
                    لمعرفة تفاصيل أوسع حول البيانات التي نجمعها وكيفية استخدامها، راجع{' '}
                    <a href="/privacy-policy" className="text-primary hover:underline">سياسة الخصوصية</a>.
                </p>
            </LegalSection>
        </LegalPageLayout>
    )
}
