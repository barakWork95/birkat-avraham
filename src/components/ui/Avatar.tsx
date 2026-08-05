/**
 * Avatar — renders a photo when `src` is provided, otherwise an elegant
 * gold monogram derived from the first Hebrew letter of the name.
 * Keeps the demo free of external image assets.
 */
interface AvatarProps {
  name?: string
  src?: string | null
  size?: string
  featured?: boolean
}

export default function Avatar({ name, src, size = 'h-24 w-24', featured = false }: AvatarProps) {
  const initial = (name || '').replace(/["'׳״]/g, '').trim().charAt(0) || 'ב'

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${size} rounded-full object-cover ring-4 ${featured ? 'ring-gold' : 'ring-gold/30'}`}
      />
    )
  }

  return (
    <div
      className={`${size} grid place-items-center rounded-full font-heading text-3xl ring-4 ${
        featured ? 'ring-gold' : 'ring-gold/30'
      }`}
      style={{
        background: 'radial-gradient(circle at 30% 25%, #2B1B17, #1A1110)',
        color: '#D4AF37',
      }}
      aria-hidden="true"
    >
      {initial}
    </div>
  )
}
