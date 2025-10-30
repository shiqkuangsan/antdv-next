import type { VueNode } from '../../_util/type.ts'
import { createVNode, defineComponent, isVNode } from 'vue'
import { getSlotPropsFnRun } from '../../_util/tools.ts'
import { Looper } from './Looper.tsx'

export interface IndicatorProps {
  prefixCls: string
  indicator?: VueNode
  percent?: number
}

const defaultProps = {
  indicator: undefined,
} as any

const Indicator = defineComponent<IndicatorProps>(
  (props = defaultProps, { slots }) => {
    return () => {
      const { prefixCls, percent } = props
      const dotClassName = `${prefixCls}-dot`
      const indicator = getSlotPropsFnRun(slots, props, 'indicator')

      if (indicator && isVNode(indicator)) {
        return createVNode(indicator, {
          class: dotClassName,
          percent,
        })
      }

      return <Looper prefixCls={prefixCls} percent={percent} />
    }
  },
)

export default Indicator
