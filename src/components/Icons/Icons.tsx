import { lazy, Suspense } from 'react'

import type { IconComponent } from './Icons.types'
const ReactIcon = lazy(() => import('@assets/icons/react.svg?react'))
const LinkedInIcon = lazy(() => import('@assets/icons/linkedin.svg?react'))
const PinIcon = lazy(() => import('@assets/icons/pin.svg?react'))
const ClockIcon = lazy(() => import('@assets/icons/clock.svg?react'))
const CheckIcon = lazy(() => import('@assets/icons/check.svg?react'))
const TypescriptIcon = lazy(() => import('@assets/icons/typescript.svg?react'))
const JavascriptIcon = lazy(() => import('@assets/icons/javascript.svg?react'))
const TailwindcssIcon = lazy(() => import('@assets/icons/tailwindcss.svg?react'))
const NodejsIcon = lazy(() => import('@assets/icons/nodejs.svg?react'))
const PlaywrightIcon = lazy(() => import('@assets/icons/playwright.svg?react'))
const JestIcon = lazy(() => import('@assets/icons/jest.svg?react'))
const GraphqlIcon = lazy(() => import('@assets/icons/graphql.svg?react'))
const PostgresqlIcon = lazy(() => import('@assets/icons/postgresql.svg?react'))
const DockerIcon = lazy(() => import('@assets/icons/docker.svg?react'))
const SendIcon = lazy(() => import('@assets/icons/send.svg?react'))
const ViteIcon = lazy(() => import('@assets/icons/vite.svg?react'))

const withColor =
  (C: React.ComponentType<React.SVGProps<SVGSVGElement>>) =>
  ({ color = 'currentColor', ...props }) => <C {...props} style={{ color }} />

export const Icons: IconComponent = {
  LinkedIn: props => (
    <Suspense fallback={<span className="inline-block w-5 h-5" />}>
      {withColor(LinkedInIcon)(props)}
    </Suspense>
  ),

  React: props => (
    <Suspense fallback={<span className="inline-block w-5 h-5" />}>
      {withColor(ReactIcon)(props)}
    </Suspense>
  ),

  Pin: props => (
    <Suspense fallback={<span className="inline-block w-5 h-5" />}>
      {withColor(PinIcon)(props)}
    </Suspense>
  ),

  Clock: props => (
    <Suspense fallback={<span className="inline-block w-5 h-5" />}>
      {withColor(ClockIcon)(props)}
    </Suspense>
  ),

  Check: props => (
    <Suspense fallback={<span className="inline-block w-5 h-5" />}>
      {withColor(CheckIcon)(props)}
    </Suspense>
  ),
  Typescript: props => (
    <Suspense fallback={<span className="inline-block w-5 h-5" />}>
      {withColor(TypescriptIcon)(props)}
    </Suspense>
  ),
  Javascript: props => (
    <Suspense fallback={<span className="inline-block w-5 h-5" />}>
      {withColor(JavascriptIcon)(props)}
    </Suspense>
  ),
  Tailwindcss: props => (
    <Suspense fallback={<span className="inline-block w-5 h-5" />}>
      {withColor(TailwindcssIcon)(props)}
    </Suspense>
  ),
  Nodejs: props => (
    <Suspense fallback={<span className="inline-block w-5 h-5" />}>
      {withColor(NodejsIcon)(props)}
    </Suspense>
  ),
  Playwright: props => (
    <Suspense fallback={<span className="inline-block w-5 h-5" />}>
      {withColor(PlaywrightIcon)(props)}
    </Suspense>
  ),
  Jest: props => (
    <Suspense fallback={<span className="inline-block w-5 h-5" />}>
      {withColor(JestIcon)(props)}
    </Suspense>
  ),
  Graphql: props => (
    <Suspense fallback={<span className="inline-block w-5 h-5" />}>
      {withColor(GraphqlIcon)(props)}
    </Suspense>
  ),
  Postgresql: props => (
    <Suspense fallback={<span className="inline-block w-5 h-5" />}>
      {withColor(PostgresqlIcon)(props)}
    </Suspense>
  ),
  Docker: props => (
    <Suspense fallback={<span className="inline-block w-5 h-5" />}>
      {withColor(DockerIcon)(props)}
    </Suspense>
  ),
  Git: props => (
    <Suspense fallback={<span className="inline-block w-5 h-5" />}>
      {withColor(lazy(() => import('@assets/icons/git.svg?react')))(props)}
    </Suspense>
  ),
  GithubActions: props => (
    <Suspense fallback={<span className="inline-block w-5 h-5" />}>
      {withColor(lazy(() => import('@assets/icons/github-actions.svg?react')))(props)}
    </Suspense>
  ),
  Send: props => (
    <Suspense fallback={<span className="inline-block w-5 h-5" />}>
      {withColor(SendIcon)(props)}
    </Suspense>
  ),
  Vite: props => (
    <Suspense fallback={<span className="inline-block w-5 h-5" />}>
      {withColor(ViteIcon)(props)}
    </Suspense>
  ),
}
