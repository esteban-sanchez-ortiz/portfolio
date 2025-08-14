import type { ChipProps } from './Chip.types'

export const Chip = ({ icon, children }: ChipProps) => {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
      {icon}
      {children}
    </span>
  )
}
