const BRANDS: Record<string, { accent: string; mono?: boolean; bgType?: 'light' | 'dark' }> = {
  'Bearing AI': { accent: '#10b981', bgType: 'dark' },
  Perficient: { accent: '#22c55e', mono: true },
  Appinit: { accent: '#38bdf8', mono: true, bgType: 'dark' },
  'Solutto Consulting': { accent: '#f97316', bgType: 'light' },
}

export const BrandAvatar = ({ src, company }: { src: string; company: string }) => {
  const brand = BRANDS[company] ?? { accent: '#22c55e', bgType: 'dark' }
  const bgClass =
    brand.bgType === 'light' ? 'bg-white ring-1 ring-black/10' : 'bg-zinc-900 ring-1 ring-white/10'

  const handleImgError: React.ReactEventHandler<HTMLImageElement> = e => {
    const img = e.currentTarget
    img.style.display = 'none'

    const parent = img.parentElement
    if (!parent) return

    parent.textContent = (company?.[0] ?? '?').toUpperCase()
    parent.classList.add('text-zinc-800', 'font-semibold')
  }

  return (
    <span
      className={`relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full overflow-hidden ${bgClass}`}
    >
      <img
        src={src}
        alt={`${company} logo`}
        className={[
          'h-full w-full object-contain p-1.5',
          brand.mono ? 'invert brightness-0 contrast-100' : 'contrast-110 saturate-110',
        ].join(' ')}
        onError={handleImgError}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{ boxShadow: `0 0 0 2px #ffffff12, 0 6px 20px ${brand.accent}22` }}
      />
    </span>
  )
}
