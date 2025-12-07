import type { Ref } from 'vue'
import type { PanelProps } from '../interface'
import { computed, isVNode, shallowRef, watch } from 'vue'

export type ItemType = Omit<PanelProps, 'collapsible'> & {
  collapsible: {
    start?: boolean
    end?: boolean
    showCollapsibleIcon: 'auto' | boolean
  }
  _$slots?: Record<string, any>
}

function getCollapsible(collapsible?: PanelProps['collapsible']): ItemType['collapsible'] {
  if (collapsible && typeof collapsible === 'object') {
    return {
      ...collapsible,
      showCollapsibleIcon: collapsible.showCollapsibleIcon === undefined ? 'auto' : collapsible.showCollapsibleIcon,
    }
  }

  const mergedCollapsible = !!collapsible
  return {
    start: mergedCollapsible,
    end: mergedCollapsible,
    showCollapsibleIcon: 'auto',
  }
}

/**
 * Convert `children` into `items`.
 */
function useItems(children: Ref<any[]>): Ref<ItemType[]> {
  const items = shallowRef<ItemType[]>([])

  /**
   * perf Watch children change and update items
   */
  watch(
    children,
    () => {
      const newItems = children.value?.filter(item => isVNode(item)).map((node) => {
        const { props, children } = node
        const { collapsible, ...restProps } = (props ?? {}) as PanelProps
        return {
          ...restProps,
          collapsible: getCollapsible(collapsible),
          _$slots: children,
        } as ItemType
      }) || []
      // 对比一下两个是否相等，避免不必要的更新
      items.value = newItems
    },
  )

  return computed(() => items.value)
}

export default useItems
