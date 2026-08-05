/**
 * Skeleton — a subtle animated placeholder block shown while async content
 * (Firestore reads) is loading, so sections never flash empty. Uses the theme's
 * ink tint over cream to stay on-brand.
 */
export default function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-ink/5 ${className}`} aria-hidden="true" />
}
