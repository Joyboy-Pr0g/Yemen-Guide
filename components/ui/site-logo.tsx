import Image from 'next/image'
import { cn, DEFAULT_SITE_LOGO } from '@/lib/utils'

interface SiteLogoProps {
  size?: number
  className?: string
  logo?: string
}

export function SiteLogo({ size = 64, className, logo }: SiteLogoProps) {
  return (
    <div
      className={cn('relative rounded-lg overflow-hidden shrink-0', className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={logo || DEFAULT_SITE_LOGO}
        alt="logo"
        fill
        className="object-contain"
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
