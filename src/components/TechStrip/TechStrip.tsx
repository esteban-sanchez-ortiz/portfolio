import { Row } from './components'

const mask =
  'linear-gradient(to right, transparent, black 48px, black calc(100% - 48px), transparent)'



export function TechStrip() {
  // Deterministic initial phase keeps static HTML and hydration consistent.
  const phase = 0

  return (
    <section
      className="relative w-full md:w-1/2 overflow-hidden py-4 sm:py-5 [--d:30s] [--nudge:0.5px]"
      style={{ WebkitMaskImage: mask, maskImage: mask }}
    >
      <div className="marquee motion-reduce:animate-none" style={{ animationDelay: `${phase}s` }}>
        <Row />
        <Row ariaHidden />
      </div>
    </section>
  )
}
