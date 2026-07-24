import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'gold' | 'green' | 'red' | 'gray' | 'blue'
}

const variants = {
  default: 'bg-primary text-white',
  gold: 'bg-accent text-white',
  green: 'bg-green-100 text-green-700',
  red: 'bg-red-100 text-red-600',
  gray: 'bg-gray-100 text-gray-600',
  blue: 'bg-blue-100 text-blue-700',
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium w-fit',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
