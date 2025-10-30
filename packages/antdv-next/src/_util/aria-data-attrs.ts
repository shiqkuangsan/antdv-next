import type { AriaAttributes } from 'vue'

export type HTMLAriaDataAttributes = AriaAttributes & {
  [key: `data-${string}`]: unknown
} & Pick<HTMLDivElement, 'role'>
