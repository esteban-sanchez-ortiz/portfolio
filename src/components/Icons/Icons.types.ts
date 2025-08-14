import type { JSX } from 'react'

export type IconComponent = {
  [key: string]: (props: React.SVGProps<SVGSVGElement>) => JSX.Element
}
