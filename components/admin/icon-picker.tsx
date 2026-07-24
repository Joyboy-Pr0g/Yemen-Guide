'use client'

import { useState, useMemo } from 'react'
import { X, Search, Smile } from 'lucide-react'
import { FaIcon } from '@/components/ui/fa-icon'
import { findIconDefinition } from '@fortawesome/fontawesome-svg-core'
import type { IconName } from '@fortawesome/fontawesome-svg-core'
import { resolveIconName } from '@/components/ui/fa-icon'
import { cn } from '@/lib/utils'

interface IconGroup {
  label: string
  icons: { value: string; label: string }[]
}

const ICON_GROUPS: IconGroup[] = [
  {
    label: 'عام',
    icons: [
      { value: 'fa-store', label: 'متجر' },
      { value: 'fa-building', label: 'مبنى' },
      { value: 'fa-house', label: 'منزل' },
      { value: 'fa-star', label: 'نجمة' },
      { value: 'fa-heart', label: 'قلب' },
      { value: 'fa-magnifying-glass', label: 'بحث' },
      { value: 'fa-bell', label: 'جرس' },
      { value: 'fa-location-dot', label: 'موقع' },
      { value: 'fa-map-pin', label: 'دبوس' },
      { value: 'fa-tag', label: 'وسم' },
      { value: 'fa-tags', label: 'وسوم' },
      { value: 'fa-award', label: 'جائزة' },
      { value: 'fa-shield', label: 'درع' },
      { value: 'fa-globe', label: 'كرة أرضية' },
      { value: 'fa-phone', label: 'هاتف' },
      { value: 'fa-envelope', label: 'بريد' },
      { value: 'fa-clock', label: 'ساعة' },
      { value: 'fa-calendar', label: 'تقويم' },
      { value: 'fa-users', label: 'مستخدمون' },
      { value: 'fa-gear', label: 'إعدادات' },
      { value: 'fa-circle-info', label: 'معلومات' },
      { value: 'fa-briefcase', label: 'حقيبة' },
      { value: 'fa-list', label: 'قائمة' },
      { value: 'fa-map', label: 'خريطة' },
    ],
  },
  {
    label: 'طعام وتسوق',
    icons: [
      { value: 'fa-utensils', label: 'أدوات مائدة' },
      { value: 'fa-basket-shopping', label: 'سلة تسوق' },
      { value: 'fa-cart-shopping', label: 'عربة تسوق' },
      { value: 'fa-mug-hot', label: 'قهوة' },
      { value: 'fa-pizza-slice', label: 'بيتزا' },
      { value: 'fa-burger', label: 'برغر' },
      { value: 'fa-cake-candles', label: 'كعكة' },
      { value: 'fa-wine-glass', label: 'كأس' },
      { value: 'fa-apple-whole', label: 'تفاحة' },
      { value: 'fa-carrot', label: 'جزرة' },
      { value: 'fa-bowl-food', label: 'طبق' },
      { value: 'fa-fish', label: 'سمك' },
      { value: 'fa-bread-slice', label: 'خبز' },
      { value: 'fa-ice-cream', label: 'آيس كريم' },
    ],
  },
  {
    label: 'صحة وطب',
    icons: [
      { value: 'fa-stethoscope', label: 'سماعة طبية' },
      { value: 'fa-hospital', label: 'مستشفى' },
      { value: 'fa-heart-pulse', label: 'نبضات قلب' },
      { value: 'fa-pills', label: 'أدوية' },
      { value: 'fa-syringe', label: 'حقنة' },
      { value: 'fa-tooth', label: 'أسنان' },
      { value: 'fa-eye', label: 'عين' },
      { value: 'fa-brain', label: 'دماغ' },
      { value: 'fa-baby', label: 'طفل' },
      { value: 'fa-wheelchair', label: 'كرسي متحرك' },
      { value: 'fa-bandage', label: 'ضمادة' },
      { value: 'fa-kit-medical', label: 'طقم طبي' },
      { value: 'fa-microscope', label: 'مجهر' },
      { value: 'fa-dna', label: 'جينات' },
    ],
  },
  {
    label: 'تعليم',
    icons: [
      { value: 'fa-graduation-cap', label: 'قبعة تخرج' },
      { value: 'fa-book', label: 'كتاب' },
      { value: 'fa-book-open', label: 'كتاب مفتوح' },
      { value: 'fa-school', label: 'مدرسة' },
      { value: 'fa-pen', label: 'قلم' },
      { value: 'fa-pencil', label: 'قلم رصاص' },
      { value: 'fa-chalkboard-user', label: 'معلم' },
      { value: 'fa-atom', label: 'ذرة' },
      { value: 'fa-flask', label: 'أنبوب تجارب' },
    ],
  },
  {
    label: 'نقل ومواصلات',
    icons: [
      { value: 'fa-car', label: 'سيارة' },
      { value: 'fa-bus', label: 'حافلة' },
      { value: 'fa-plane', label: 'طائرة' },
      { value: 'fa-taxi', label: 'تاكسي' },
      { value: 'fa-motorcycle', label: 'دراجة نارية' },
      { value: 'fa-bicycle', label: 'دراجة' },
      { value: 'fa-truck', label: 'شاحنة' },
      { value: 'fa-train', label: 'قطار' },
      { value: 'fa-ship', label: 'سفينة' },
      { value: 'fa-gas-pump', label: 'وقود' },
      { value: 'fa-road', label: 'طريق' },
      { value: 'fa-helicopter', label: 'مروحية' },
    ],
  },
  {
    label: 'خدمات وصيانة',
    icons: [
      { value: 'fa-wrench', label: 'مفتاح ربط' },
      { value: 'fa-hammer', label: 'مطرقة' },
      { value: 'fa-screwdriver-wrench', label: 'أدوات' },
      { value: 'fa-scissors', label: 'مقص' },
      { value: 'fa-paintbrush', label: 'فرشاة' },
      { value: 'fa-bolt', label: 'كهرباء' },
      { value: 'fa-fire', label: 'نار' },
      { value: 'fa-droplet', label: 'ماء' },
      { value: 'fa-broom', label: 'مكنسة' },
      { value: 'fa-toolbox', label: 'صندوق أدوات' },
      { value: 'fa-recycle', label: 'إعادة تدوير' },
      { value: 'fa-screwdriver', label: 'مفك' },
    ],
  },
  {
    label: 'تكنولوجيا',
    icons: [
      { value: 'fa-laptop', label: 'لابتوب' },
      { value: 'fa-mobile-screen-button', label: 'هاتف ذكي' },
      { value: 'fa-wifi', label: 'واي فاي' },
      { value: 'fa-desktop', label: 'حاسوب' },
      { value: 'fa-keyboard', label: 'لوحة مفاتيح' },
      { value: 'fa-camera', label: 'كاميرا' },
      { value: 'fa-print', label: 'طباعة' },
      { value: 'fa-microchip', label: 'شريحة' },
      { value: 'fa-plug', label: 'مقبس' },
      { value: 'fa-battery-full', label: 'بطارية' },
      { value: 'fa-satellite-dish', label: 'طبق' },
      { value: 'fa-server', label: 'خادم' },
      { value: 'fa-hard-drive', label: 'قرص صلب' },
      { value: 'fa-headphones', label: 'سماعات' },
    ],
  },
  {
    label: 'مال وأعمال',
    icons: [
      { value: 'fa-dollar-sign', label: 'دولار' },
      { value: 'fa-credit-card', label: 'بطاقة ائتمان' },
      { value: 'fa-building-columns', label: 'بنك' },
      { value: 'fa-coins', label: 'عملات' },
      { value: 'fa-chart-line', label: 'مخطط خطي' },
      { value: 'fa-money-bill-wave', label: 'ورقة نقدية' },
      { value: 'fa-receipt', label: 'إيصال' },
      { value: 'fa-wallet', label: 'محفظة' },
      { value: 'fa-piggy-bank', label: 'توفير' },
      { value: 'fa-hand-holding-dollar', label: 'تمويل' },
      { value: 'fa-chart-bar', label: 'مخطط أعمدة' },
      { value: 'fa-chart-pie', label: 'مخطط دائري' },
      { value: 'fa-scale-balanced', label: 'ميزان' },
    ],
  },
  {
    label: 'جمال وأزياء',
    icons: [
      { value: 'fa-gem', label: 'جوهرة' },
      { value: 'fa-face-smile', label: 'ابتسامة' },
      { value: 'fa-spa', label: 'سبا' },
      { value: 'fa-shower', label: 'دش' },
      { value: 'fa-shirt', label: 'قميص' },
      { value: 'fa-glasses', label: 'نظارة' },
      { value: 'fa-ring', label: 'خاتم' },
      { value: 'fa-person-dress', label: 'فستان' },
      { value: 'fa-hat-cowboy', label: 'قبعة' },
      { value: 'fa-socks', label: 'جوارب' },
      { value: 'fa-mitten', label: 'قفاز' },
    ],
  },
  {
    label: 'ترفيه ورياضة',
    icons: [
      { value: 'fa-music', label: 'موسيقى' },
      { value: 'fa-film', label: 'سينما' },
      { value: 'fa-gamepad', label: 'ألعاب' },
      { value: 'fa-dumbbell', label: 'رياضة' },
      { value: 'fa-futbol', label: 'كرة قدم' },
      { value: 'fa-basketball', label: 'كرة سلة' },
      { value: 'fa-chess', label: 'شطرنج' },
      { value: 'fa-dice', label: 'نرد' },
      { value: 'fa-trophy', label: 'كأس' },
      { value: 'fa-ticket', label: 'تذكرة' },
      { value: 'fa-guitar', label: 'جيتار' },
      { value: 'fa-palette', label: 'لوحة فنان' },
      { value: 'fa-masks-theater', label: 'مسرح' },
      { value: 'fa-camera-retro', label: 'تصوير' },
    ],
  },
  {
    label: 'عقارات ومنازل',
    icons: [
      { value: 'fa-key', label: 'مفتاح' },
      { value: 'fa-door-open', label: 'باب' },
      { value: 'fa-couch', label: 'أريكة' },
      { value: 'fa-bath', label: 'حمام' },
      { value: 'fa-bed', label: 'سرير' },
      { value: 'fa-house-chimney-window', label: 'فيلا' },
      { value: 'fa-ruler-combined', label: 'مقياس' },
      { value: 'fa-paint-roller', label: 'دهان' },
      { value: 'fa-warehouse', label: 'مستودع' },
      { value: 'fa-building-user', label: 'مكتب' },
      { value: 'fa-stairs', label: 'درج' },
    ],
  },
  {
    label: 'طبيعة وبيئة',
    icons: [
      { value: 'fa-leaf', label: 'ورقة' },
      { value: 'fa-tree', label: 'شجرة' },
      { value: 'fa-sun', label: 'شمس' },
      { value: 'fa-moon', label: 'قمر' },
      { value: 'fa-snowflake', label: 'ثلج' },
      { value: 'fa-umbrella', label: 'مظلة' },
      { value: 'fa-seedling', label: 'زراعة' },
      { value: 'fa-paw', label: 'حيوان' },
      { value: 'fa-water', label: 'مياه' },
      { value: 'fa-mountain-sun', label: 'جبل' },
      { value: 'fa-wind', label: 'ريح' },
      { value: 'fa-fire-flame-curved', label: 'لهب' },
    ],
  },
]

interface IconPickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

function iconExists(faValue: string): boolean {
  const name = resolveIconName(faValue) as IconName
  return !!findIconDefinition({ prefix: 'fas', iconName: name })
}

export function IconPicker({ value, onChange, className }: IconPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return ICON_GROUPS.map((group) => ({
      ...group,
      icons: group.icons.filter(
        (icon) =>
          iconExists(icon.value) &&
          (!q || icon.label.includes(q) || icon.value.replace('fa-', '').includes(q))
      ),
    })).filter((group) => group.icons.length > 0)
  }, [search])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 text-sm hover:border-primary transition-colors bg-white',
          className
        )}
      >
        {value ? (
          <>
            <FaIcon icon={value} className="w-4 h-4 text-primary shrink-0" />
            <span dir="ltr" className="text-gray-600 truncate">{value}</span>
          </>
        ) : (
          <>
            <Smile className="w-4 h-4 text-gray-300 shrink-0" />
            <span className="text-gray-400">اختر أيقونة</span>
          </>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl" style={{ maxHeight: '85vh' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
              <h3 className="font-bold text-gray-800">مكتبة الأيقونات</h3>
              <button
                type="button"
                onClick={() => { setOpen(false); setSearch('') }}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="px-5 py-3 border-b border-gray-50 shrink-0">
              <div className="relative">
                <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ابحث عن أيقونة..."
                  className="w-full border border-gray-200 rounded-xl pr-10 pl-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  autoFocus
                />
              </div>
            </div>

            {/* Icon grid */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {filtered.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-8">لا توجد نتائج</p>
              )}
              {filtered.map((group) => (
                <div key={group.label}>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{group.label}</p>
                  <div className="grid grid-cols-8 gap-1">
                    {group.icons.map((icon) => (
                      <button
                        key={icon.value}
                        type="button"
                        title={icon.label}
                        onClick={() => { onChange(icon.value); setOpen(false); setSearch('') }}
                        className={cn(
                          'flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all hover:bg-primary/5',
                          value === icon.value
                            ? 'bg-primary/10 ring-2 ring-primary/30'
                            : 'hover:scale-105'
                        )}
                      >
                        <FaIcon icon={icon.value} className="w-5 h-5 text-gray-600" />
                        <span className="text-[9px] text-gray-400 truncate w-full text-center leading-none">{icon.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50 rounded-b-2xl">
              {value ? (
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FaIcon icon={value} className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700">الأيقونة المختارة</p>
                    <p className="text-[11px] text-gray-400" dir="ltr">{value}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400">لم يتم اختيار أيقونة</p>
              )}
              {value && (
                <button
                  type="button"
                  onClick={() => { onChange(''); setOpen(false) }}
                  className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  إزالة الأيقونة
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
