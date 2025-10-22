import { skillsData } from '@data'

export const Row = ({ ariaHidden = false }: { ariaHidden?: boolean }) => {
  return (
    <div className="flex gap-10" aria-hidden={ariaHidden || undefined}>
      {skillsData
        .filter(({ icon }) => icon != null)
        .map(({ name, icon: Icon }, i) => (
          <div
            key={`${name}-${i}`}
            className="shrink-0 min-w-[60px] flex flex-col items-center gap-2"
          >
            {Icon && (
              <Icon className="h-10 w-10 transition-transform duration-200 hover:scale-[1.04] active:scale-[0.98]" />
            )}
            <span className="text-xs text-zinc-700 dark:text-zinc-400 text-center">{name}</span>
          </div>
        ))}
    </div>
  )
}
