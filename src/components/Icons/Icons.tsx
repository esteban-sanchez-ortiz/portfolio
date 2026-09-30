import type { IconComponent } from './Icons.types'

import ReactIcon from '@assets/icons/react.svg?react'
import LinkedInIcon from '@assets/icons/linkedin.svg?react'
import PinIcon from '@assets/icons/pin.svg?react'
import ClockIcon from '@assets/icons/clock.svg?react'
import CheckIcon from '@assets/icons/check.svg?react'
import TypescriptIcon from '@assets/icons/typescript.svg?react'
import JavascriptIcon from '@assets/icons/javascript.svg?react'
import TailwindcssIcon from '@assets/icons/tailwindcss.svg?react'
import NodejsIcon from '@assets/icons/nodejs.svg?react'
import PlaywrightIcon from '@assets/icons/playwright.svg?react'
import JestIcon from '@assets/icons/jest.svg?react'
import GraphqlIcon from '@assets/icons/graphql.svg?react'
import PostgresqlIcon from '@assets/icons/postgresql.svg?react'
import DockerIcon from '@assets/icons/docker.svg?react'
import SendIcon from '@assets/icons/send.svg?react'
import ViteIcon from '@assets/icons/vite.svg?react'
import GitIcon from '@assets/icons/git.svg?react'
import GithubActionsIcon from '@assets/icons/github-actions.svg?react'

export const Icons: IconComponent = {
  LinkedIn: ({ color = 'currentColor', ...props }) => (
    <LinkedInIcon {...props} aria-hidden="true" style={{ color }} />
  ),
  React: ({ color = 'currentColor', ...props }) => (
    <ReactIcon {...props} aria-hidden="true" style={{ color }} />
  ),
  Pin: ({ color = 'currentColor', ...props }) => (
    <PinIcon {...props} aria-hidden="true" style={{ color }} />
  ),
  Clock: ({ color = 'currentColor', ...props }) => (
    <ClockIcon {...props} aria-hidden="true" style={{ color }} />
  ),
  Check: ({ color = 'currentColor', ...props }) => (
    <CheckIcon {...props} aria-hidden="true" style={{ color }} />
  ),
  Typescript: ({ color = 'currentColor', ...props }) => (
    <TypescriptIcon {...props} aria-hidden="true" style={{ color }} />
  ),
  Javascript: ({ color = 'currentColor', ...props }) => (
    <JavascriptIcon {...props} aria-hidden="true" style={{ color }} />
  ),
  Tailwindcss: ({ color = 'currentColor', ...props }) => (
    <TailwindcssIcon {...props} aria-hidden="true" style={{ color }} />
  ),
  Nodejs: ({ color = 'currentColor', ...props }) => (
    <NodejsIcon {...props} aria-hidden="true" style={{ color }} />
  ),
  Playwright: ({ color = 'currentColor', ...props }) => (
    <PlaywrightIcon {...props} aria-hidden="true" style={{ color }} />
  ),
  Jest: ({ color = 'currentColor', ...props }) => (
    <JestIcon {...props} aria-hidden="true" style={{ color }} />
  ),
  Graphql: ({ color = 'currentColor', ...props }) => (
    <GraphqlIcon {...props} aria-hidden="true" style={{ color }} />
  ),
  Postgresql: ({ color = 'currentColor', ...props }) => (
    <PostgresqlIcon {...props} aria-hidden="true" style={{ color }} />
  ),
  Docker: ({ color = 'currentColor', ...props }) => (
    <DockerIcon {...props} aria-hidden="true" style={{ color }} />
  ),
  Git: ({ color = 'currentColor', ...props }) => (
    <GitIcon {...props} aria-hidden="true" style={{ color }} />
  ),
  GithubActions: ({ color = 'currentColor', ...props }) => (
    <GithubActionsIcon {...props} aria-hidden="true" style={{ color }} />
  ),
  Send: ({ color = 'currentColor', ...props }) => (
    <SendIcon {...props} aria-hidden="true" style={{ color }} />
  ),
  Vite: ({ color = 'currentColor', ...props }) => (
    <ViteIcon {...props} aria-hidden="true" style={{ color }} />
  ),
}
