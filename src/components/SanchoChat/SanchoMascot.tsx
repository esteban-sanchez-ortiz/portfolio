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

// Waving right arm, two frames (hand up / hand mid) toggled by CSS steps.
const ARM_UP = [
  { x: 14, y: 8, c: 'C' },
  { x: 15, y: 7, c: 'S' },
  { x: 15, y: 6, c: 'S' },
  { x: 15, y: 5, c: 's' },
]
const ARM_MID = [
  { x: 14, y: 9, c: 'C' },
  { x: 15, y: 9, c: 'S' },
  { x: 15, y: 8, c: 'S' },
]

const toPixels = (cells: Array<{ x: number; y: number; c: string }>) =>
  cells.map(({ x, y, c }) => ({ x, y, fill: PALETTE[c] ?? '#000' }))

const PIXELS = ROWS.flatMap((row, y) =>
  [...row].flatMap((ch, x) => (ch === '.' ? [] : [{ x, y, fill: PALETTE[ch] ?? '#000' }])),
)

interface SanchoMascotProps {
  size?: number
  className?: string
  /** Animate a two-frame pixel wave with the right arm. */
  wave?: boolean
}

export const SanchoMascot = ({ size = 24, className, wave = false }: SanchoMascotProps) => (
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
    {wave && (
      <>
        <g style={{ animation: 'sancho-frame-a 0.9s steps(1) infinite' }}>
          {toPixels(ARM_UP).map(({ x, y, fill }, i) => (
            <rect key={i} x={x} y={y} width={1} height={1} fill={fill} />
          ))}
        </g>
        <g style={{ animation: 'sancho-frame-b 0.9s steps(1) infinite' }}>
          {toPixels(ARM_MID).map(({ x, y, fill }, i) => (
            <rect key={i} x={x} y={y} width={1} height={1} fill={fill} />
          ))}
        </g>
      </>
    )}
  </svg>
)
