import { Row } from './components'

const mask =
  'linear-gradient(to right, transparent, black 48px, black calc(100% - 48px), transparent)'

const DURATION_S = 30

export function TechStrip() {
  // Negative delay anchored to the clock: the marquee keeps its phase across
  // remounts (route changes, chat expanding) instead of restarting from zero.
  const phase = -((Date.now() / 1000) % DURATION_S)

  return (
    <section
      className="relative w-full md:w-1/2 overflow-hidden py-8 sm:py-10 [--d:30s] [--nudge:0.5px]"
      style={{ WebkitMaskImage: mask, maskImage: mask }}
    >
      <div className="marquee motion-reduce:animate-none" style={{ animationDelay: `${phase}s` }}>
        <Row />
        <Row ariaHidden />
      </div>
    </section>
  )
}
