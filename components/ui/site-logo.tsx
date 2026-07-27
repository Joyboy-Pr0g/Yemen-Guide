import Image from 'next/image'
import Link from 'next/link'
import { cn, DEFAULT_SITE_LOGO } from '@/lib/utils'

interface SiteLogoProps {
  size?: number
  className?: string
  logo?: string
  variant?: 'default' | 'footer'
}

export function SiteLogo({ size = 64, className, logo, variant = 'default' }: SiteLogoProps) {
  const src = logo || DEFAULT_SITE_LOGO

  if (variant === 'footer') {
    return (
      <div
        className={cn(
          'relative shrink-0 rounded-2xl p-[2px]',
          'bg-gradient-to-br from-white/30 via-white/15 to-white/5',
          'ring-1 ring-white/25 shadow-lg shadow-black/20',
          className,
        )}
      >
        <div className="rounded-[14px] bg-white px-2.5 py-1.5 flex items-center justify-center min-h-[44px]">
          <Image
            src={src}
            alt="شعار دليل اليمن"
            width={128}
            height={40}
            className="h-9 w-auto max-w-[128px] object-contain object-center"
            unoptimized
          />
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn('relative rounded-lg overflow-hidden shrink-0', className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt="logo"
        fill
        className="object-contain rounded-lg"
        sizes={`${size}px`}
        unoptimized
      />
    </div>
  )
}

export function SiteName({ className, name = 'دُّلني-اليمن' }: { className?: string; name?: string }) {
  return (
    <span className={cn('font-bold text-primary', className)}>
      {name}
    </span>
  )
}

/** Footer brand row: logo badge + site name, links to home */
export function FooterBrand({
  logo,
  name = 'دُّلني-اليمن',
}: {
  logo?: string
  name?: string
}) {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-3 mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-lg"
    >
      <SiteLogo logo={logo} variant="footer" className="transition-transform group-hover:scale-[1.02]" />
      <SiteName
        name={name}
        className="text-lg sm:text-xl text-white tracking-tight group-hover:text-accent transition-colors"
      />
    </Link>
  )
}
