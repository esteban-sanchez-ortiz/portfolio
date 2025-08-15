import { Icons } from '@components'

const SKILLS = [
  { name: 'React', icon: Icons.React },
  { name: 'TypeScript', icon: Icons.Typescript },
  { name: 'JavaScript', icon: Icons.Javascript },
  { name: 'Tailwind CSS', icon: Icons.Tailwindcss },
  { name: 'Node.js', icon: Icons.Nodejs },
  { name: 'Playwright', icon: Icons.Playwright },
  { name: 'Jest', icon: Icons.Jest },
  { name: 'GraphQL', icon: Icons.Graphql },
  { name: 'PostgreSQL', icon: Icons.Postgresql },
  { name: 'Docker', icon: Icons.Docker },
  { name: 'Git', icon: Icons.Git },
  { name: 'GitHub Actions', icon: Icons.GithubActions },
]

export const Row = ({ ariaHidden = false }: { ariaHidden?: boolean }) => {
  return (
    <div className="flex gap-10" aria-hidden={ariaHidden || undefined}>
      {SKILLS.map(({ name, icon: Icon }, i) => (
        <div
          key={`${name}-${i}`}
          className="shrink-0 min-w-[60px] flex flex-col items-center gap-2"
        >
          <Icon className="h-10 w-10 transition-transform duration-200 hover:scale-[1.04] active:scale-[0.98]" />
          <span className="text-xs text-zinc-700 dark:text-zinc-400 text-center">{name}</span>
        </div>
      ))}
    </div>
  )
}
