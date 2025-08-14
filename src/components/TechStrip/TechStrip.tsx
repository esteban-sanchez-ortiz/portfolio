import { Row } from './components'

const mask =
  'linear-gradient(to right, transparent, black 48px, black calc(100% - 48px), transparent)'

export function TechStrip() {
  return (
    <section
      className="relative w-1/2 overflow-hidden py-10 sm:py-14 [--d:30s] [--nudge:0.5px]"
      style={{ WebkitMaskImage: mask, maskImage: mask }}
    >
      <div className="marquee motion-reduce:animate-none">
        <Row />
        <Row ariaHidden />
      </div>
    </section>
  )
}
