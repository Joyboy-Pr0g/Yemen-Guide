import { HeroAnimation } from '@/components/Home/HeroAnimation'
import { AboutSlider } from '@/components/Home/AboutSlider'
import type { Category, City } from '@/types'

interface HeroSectionProps {
  cats: Category[]
  cities: City[]
}

export function HeroSection({ cats, cities }: HeroSectionProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #002623 0%, #054239 40%, #0a6b5a 70%, #428177 100%)',
        minHeight: 520,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[700px] h-[700px] rounded-full opacity-[0.12]"
          style={{
            background: 'radial-gradient(circle, #b9a779 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ lineHeight: 0 }}>
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ display: 'block', width: '100%', height: 60 }}
        >
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" fill="#faf9f7" />
        </svg>
      </div>

      <HeroAnimation cats={cats} cities={cities} />

      <div className="relative z-20 px-4 pb-20 sm:pb-24 flex flex-col items-center">
        <AboutSlider />
      </div>
    </section>
  )
}
