'use client'

import { useEffect, useState } from 'react'
import { Loader2, Upload, Mail, Globe, FileText, Sliders, Settings, Image as ImageIcon, Save } from 'lucide-react'
import { useAdminSettings, useUpdateSettings, useUploadLogo } from '@/hooks/use-admin'
import { getImageUrl } from '@/lib/utils'
import Image from 'next/image'
import { useSettings } from '@/context/settings-context'
import { SiteSettings } from '@/types'

const SETTING_LABELS: Record<string, string> = {
  site_name: 'اسم الموقع',
  site_description: 'وصف الموقع',
  meta_keywords: 'الكلمات المفتاحية',
  contact_email: 'البريد الإلكتروني',
  facebook_url: 'رابط فيسبوك',
  instagram_url: 'رابط إنستغرام',
  whatsapp_support: 'واتساب الدعم',
}

export default function AdminSettingsPage() {
  const settings = useSettings()
  const { data: settingsData } = useAdminSettings(settings ?? undefined)
  const { mutate: updateSettings, isPending } = useUpdateSettings()
  const { mutate: uploadLogo, isPending: uploadingLogo } = useUploadLogo()
  const [values, setValues] = useState<Omit<SiteSettings, 'logo'>>({
    site_name: '',
    site_description: '',
    meta_keywords: '',
    contact_email: '',
    facebook_url: '',
    instagram_url: '',
    whatsapp_support: '',
  })
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  useEffect(() => {
    if (settingsData) {
      const vals: Omit<SiteSettings, 'logo'> = {
        site_name: settingsData.site_name,
        site_description: settingsData.site_description,
        meta_keywords: settingsData.meta_keywords,
        contact_email: settingsData.contact_email,
        facebook_url: settingsData.facebook_url,
        instagram_url: settingsData.instagram_url,
        whatsapp_support: settingsData.whatsapp_support,
      }
      setValues(vals)
    }
  }, [settings])

  const logoSetting = settings?.logo

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const settingsPayload = values
    updateSettings(settingsPayload)
  }

  const handleLogoChange = (file: File | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => setLogoPreview(e.target?.result as string)
    reader.readAsDataURL(file)
    const fd = new FormData()
    fd.append('logo', file)
    uploadLogo(fd)
  }

  // تابع داخلي مساعد أو يمكنك استبداله بأيقوناتك الخاصة لتغيير الأيقونة حسب نوع الحقل
  const getSettingIcon = (key: string) => {
    if (key.includes('email')) return <Mail className="w-4 h-4 text-gray-400" />;
    if (key.includes('url') || key.includes('link')) return <Globe className="w-4 h-4 text-gray-400" />;
    if (key.includes('description')) return <FileText className="w-4 h-4 text-gray-400" />;
    return <Sliders className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
        <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">إعدادات الموقع</h1>
          <p className="text-xs text-gray-400 mt-0.5">إدارة وتعديل البيانات العامة والشعار الأساسي للمنصة</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Right Column: Logo Management */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-bold text-sm text-gray-800 mb-1">شعار الموقع</h2>
            <p className="text-xs text-gray-400 mb-4">سيظهر الشعار في الهيدر، الفوتر، ورسائل البريد الإلكتروني.</p>

            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50/50 border-2 border-dashed border-gray-200 hover:border-primary/50 transition-colors group relative">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-inner flex items-center justify-center relative mb-4 p-2">
                {(logoPreview || logoSetting) ? (
                  <Image
                    src={logoPreview || getImageUrl(logoSetting || '')}
                    alt="Logo"
                    fill
                    className="object-contain p-2"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-gray-300">
                    <ImageIcon className="w-8 h-8 stroke-[1.5]" />
                    <span className="text-[11px]">لا يوجد شعار</span>
                  </div>
                )}
              </div>

              <label className="cursor-pointer w-full">
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-primary bg-primary/5 hover:bg-accent hover:text-accent-foreground px-4 py-2.5 rounded-xl transition-all duration-200 border border-primary/10 shadow-sm">
                  {uploadingLogo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  تغيير الشعار
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleLogoChange(e.target.files?.[0] || null)}
                />
              </label>
              <p className="text-[10px] text-gray-400 mt-2 text-center">يدعم PNG, JPG (الحد الأقصى 2 ميجابايت)</p>
            </div>
          </div>
        </div>

        {/* Left Column: Settings Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="mb-5 pb-4 border-b border-gray-50">
              <h2 className="font-bold text-sm text-gray-800">الإعدادات العامة</h2>
              <p className="text-xs text-gray-400 mt-0.5">تأكد من دقة البيانات حيث تنعكس مباشرة للمستخدمين.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Dynamic Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(SETTING_LABELS).map(([key, label]) => {
                  const isTextArea = key === 'site_description';

                  return (
                    <div key={key} className={isTextArea ? "col-span-1 sm:col-span-2" : "col-span-1"}>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-2">
                        {getSettingIcon(key)}
                        {label}
                      </label>

                      <div className="relative rounded-xl shadow-sm w-full">
                        {isTextArea ? (
                          <textarea
                            value={values[key] || ''}
                            onChange={(e) => setValues((p) => ({ ...p, [key]: e.target.value }))}
                            rows={3}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-gray-50/30 focus:bg-white resize-none transition-all leading-relaxed"
                            placeholder={`أدخل ${label}...`}
                          />
                        ) : (
                          <input
                            type={key.includes('email') ? 'email' : 'text'}
                            value={values[key as keyof Omit<SiteSettings, 'logo'>] || ''}
                            onChange={(e) => setValues((p) => ({ ...p, [key]: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-gray-50/30 focus:bg-white transition-all h-11"
                            dir={key.includes('url') || key === 'contact_email' ? 'ltr' : undefined}
                            placeholder={key.includes('url') ? 'https://...' : undefined}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Form Actions Foot */}
              <div className="pt-4 border-t border-gray-50 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 disabled:opacity-70 shadow-sm shadow-primary/10"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
