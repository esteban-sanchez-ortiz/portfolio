import { useState } from 'react'
import { brandStyles } from '@data'

export const BrandAvatar = ({ src, company }: { src: string; company: string }) => {
  const [imageError, setImageError] = useState(false)
  const brand = brandStyles[company] ?? { accent: '#22c55e', bgType: 'dark' }
  const bgClass =
    brand.bgType === 'light' ? 'bg-white ring-1 ring-black/10' : 'bg-zinc-900 ring-1 ring-white/10'

  const handleImgError = () => {
    setImageError(true)
  }

  return (
    <span
      className={`relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full overflow-hidden ${bgClass} ${
        imageError ? 'text-zinc-800 font-semibold' : ''
      }`}
    >
      {!imageError ? (
        <img
          src={src}
          alt={`${company} logo`}
          className={[
            'h-full w-full object-contain p-1.5',
            brand.mono ? 'invert brightness-0 contrast-100' : 'contrast-110 saturate-110',
          ].join(' ')}
          onError={handleImgError}
        />
      ) : (
        <span className="text-zinc-800 font-semibold">{(company?.[0] ?? '?').toUpperCase()}</span>
      )}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{ boxShadow: `0 0 0 2px #ffffff12, 0 6px 20px ${brand.accent}22` }}
      />
    </span>
  )
}
