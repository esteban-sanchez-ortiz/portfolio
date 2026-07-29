const PALETTE: Record<string, string> = {
  H: '#71717a', // helmet
  h: '#a1a1aa', // helmet highlight
  P: '#00b2a9', // plume (roulette teal)
  S: '#e8b88a', // skin
  s: '#d19a67', // skin shadow
  E: '#18181b', // eyes
  B: '#7c4a21', // beard
  C: '#00b2a9', // collar
}

// 16x16 pixel squire: morrión helmet with teal plume, big beard, teal collar.
const ROWS = [
  '................',
  '..P.hHHHHHHh....',
  '..P.HHHHHHHH....',
  '...HHHHHHHHHH...',
  '..hhhhhhhhhhhh..',
  '...SSSSSSSSSS...',
  '...SSESSSSESS...',
  '...SSSSssSSSS...',
  '...SBBBBBBBBS...',
  '...BBBBBBBBBB...',
  '...BBBBBBBBBB...',
  '....BBBBBBBB....',
  '...CCCCCCCCCC...',
  '..CCCCCCCCCCCC..',
  '................',
  '................',
]

const PIXELS = ROWS.flatMap((row, y) =>
  [...row].flatMap((ch, x) => (ch === '.' ? [] : [{ x, y, fill: PALETTE[ch] ?? '#000' }])),
)

interface SanchoMascotProps {
  size?: number
  className?: string
}

export const SanchoMascot = ({ size = 24, className }: SanchoMascotProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    shapeRendering="crispEdges"
    aria-hidden
    className={className}
  >
    {PIXELS.map(({ x, y, fill }, i) => (
      <rect key={i} x={x} y={y} width={1} height={1} fill={fill} />
    ))}
  </svg>
)
