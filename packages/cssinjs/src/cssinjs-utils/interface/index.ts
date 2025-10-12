import type { VNodeChild } from 'vue'

export type {
  ComponentToken,
  ComponentTokenKey,
  GlobalToken,
  GlobalTokenWithComponent,
  OverrideTokenMap,
  TokenMap,
  TokenMapKey,
} from './components'

export type UseComponentStyleResult = [wrapSSR: (node: VNodeChild) => VNodeChild, hashId: string]
