import type { DotProps } from './Dot.types'

export const Dot = ({ className = 'bg-orange-500' }: DotProps) => {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full [animation:dotpulse_1.6s_ease-in-out_infinite] ${className}`}
    />
  )
}
