import type { VNodeChild } from 'vue'
import { defineComponent } from 'vue'

type ComponentName
  = | 'Table'
    | 'Table.filter' /* 👈 5.20.0+ */
    | 'List'
    | 'Select'
    | 'TreeSelect'
    | 'Cascader'
    | 'Transfer'
    | 'Mentions'

interface EmptyProps {
  componentName?: ComponentName
}

export const DefaultRenderEmpty = defineComponent<EmptyProps>(
  () => {
    return () => {
      return <></>
    }
  },
  {
    name: 'ADefaultRenderEmpty',
    inheritAttrs: false,
  },
)
export type RenderEmptyHandler = (componentName?: ComponentName) => VNodeChild
