import type { Key } from '@v-c/util/dist/type'
import type { CSSProperties } from 'vue'
import type { VueNode } from '../_util/type.ts'
import type { MasonryProps } from './Masonry.tsx'
import ResizeObserver from '@v-c/resize-observer'
import { clsx } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { defineComponent } from 'vue'

export interface MasonryItemType {
  key: Key
  column?: number
  height?: number
  children?: VueNode
  data: any
  class?: string
  style?: CSSProperties
}

interface MasonryItemProps extends Pick<MasonryProps, 'itemRender'> {
  prefixCls: string
  item: MasonryItemType
  style: CSSProperties
  class?: string
  index: number
  column: number
  onResize?: VoidFunction | null
}

const MasonryItem = defineComponent<MasonryItemProps>(
  (props, { slots }) => {
    return () => {
      const { item, style, prefixCls, class: className, itemRender, index, column, onResize } = props
      const itemPrefix = `${prefixCls}-item`
      // ====================== Render ======================
      const children = filterEmpty(slots?.default?.() ?? [])
      const renderNode = children.length
        ? children
        : itemRender?.({
            ...item,
            index,
            column,
          })

      let returnNode = (
        <div style={style} class={clsx(itemPrefix, className)}>
          {renderNode}
        </div>
      )
      // Listen for resize
      if (onResize) {
        returnNode = <ResizeObserver onResize={onResize}>{returnNode}</ResizeObserver>
      }

      return returnNode
    }
  },
  {
    name: 'AMasonryItem',
    inheritAttrs: false,
  },
)

export default MasonryItem
