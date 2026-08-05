/**
 * Lightweight inline SVG icon set — no external icon dependency.
 * All icons inherit `currentColor` and accept a className.
 */
const base = 'inline-block shrink-0'

interface IconProps {
  className?: string
}

interface ToggleIconProps extends IconProps {
  filled?: boolean
}

export const MenuIcon = ({ className = 'h-6 w-6' }: IconProps) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

export const CloseIcon = ({ className = 'h-6 w-6' }: IconProps) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

export const ChevronRight = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6l6 6-6 6" />
  </svg>
)

export const ChevronLeft = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 6l-6 6 6 6" />
  </svg>
)

export const ClockIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" strokeLinecap="round" />
  </svg>
)

export const CalendarIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 9h18M8 3v4M16 3v4" strokeLinecap="round" />
  </svg>
)

export const PinIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
)

export const PhoneIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 5c0 8.3 6.7 15 15 15l1.5-3.5-4-1.5-1.7 1.7a12 12 0 01-5.5-5.5L11 9.5 9.5 5.5 6 4A2 2 0 004 5z" strokeLinejoin="round" />
  </svg>
)

export const MailIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const WhatsAppIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a10 10 0 00-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1012 2zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.8-.6-3-1.3-5-4.4-5.1-4.6-.2-.2-1.3-1.7-1.3-3.3 0-1.5.8-2.3 1.1-2.6.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .7.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.7-.1l.8-1c.2-.2.4-.2.6-.1l2 1c.3.1.5.2.5.4.1.2.1.9-.1 1.6z" />
  </svg>
)

export const HeartIcon = ({ className = 'h-5 w-5', filled = false }: ToggleIconProps) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
    <path d="M12 20s-7-4.5-9.2-9C1.5 8 3 4.5 6.3 4.5c2 0 3.2 1.3 3.7 2.3.5-1 1.7-2.3 3.7-2.3C17 4.5 18.5 8 17.2 11 15 15.5 12 20 12 20z" strokeLinejoin="round" />
  </svg>
)

export const PlayIcon = ({ className = 'h-6 w-6' }: IconProps) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
)

export const StackIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
    <rect x="7" y="3" width="14" height="14" rx="2" />
    <path d="M3 7v12a2 2 0 002 2h12" strokeLinecap="round" />
  </svg>
)

export const DownloadIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v12m0 0l-4-4m4 4l4-4" />
    <path d="M5 19h14" />
  </svg>
)

export const BookIcon = ({ className = 'h-6 w-6' }: IconProps) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M12 6c-1.5-1.2-3.5-1.8-6-1.8V18c2.5 0 4.5.6 6 1.8 1.5-1.2 3.5-1.8 6-1.8V4.2c-2.5 0-4.5.6-6 1.8zM12 6v13.8" strokeLinejoin="round" />
  </svg>
)

export const StarIcon = ({ className = 'h-6 w-6' }: IconProps) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3l1.2 3.4L16 5.6l-1 3.4 3.4 1.2L15 12l3.4 1.8-3.4 1.2 1 3.4-2.8-.8L12 21l-1.2-3.4-2.8.8 1-3.4L5.6 12 9 10.2 8 6.8l2.8.8L12 3z" />
  </svg>
)

export const HandsIcon = ({ className = 'h-6 w-6' }: IconProps) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M12 4c-.8 2-2.2 3.4-4 4 1.8.6 3.2 2 4 4 .8-2 2.2-3.4 4-4-1.8-.6-3.2-2-4-4z" strokeLinejoin="round" />
    <path d="M6 14c-.6 1.4-1.6 2.4-3 3 1.4.5 2.4 1.5 3 3M18 14c.6 1.4 1.6 2.4 3 3-1.4.5-2.4 1.5-3 3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
