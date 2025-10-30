import { classNames } from '@v-c/util'
import { defineComponent } from 'vue'
import Progress from './Progress'

export interface IndicatorProps {
  prefixCls: string
  percent?: number
}

export const Looper = defineComponent<IndicatorProps>(
  (props) => {
    return () => {
      const { prefixCls, percent = 0 } = props
      const dotClassName = `${prefixCls}-dot`
      const holderClassName = `${dotClassName}-holder`
      const hideClassName = `${holderClassName}-hidden`
      // ===================== Render =====================
      return (
        <>
          <span class={classNames(holderClassName, percent > 0 && hideClassName)}>
            <span class={classNames(dotClassName, `${prefixCls}-dot-spin`)}>
              {[1, 2, 3, 4].map(i => (
                <i class={`${prefixCls}-dot-item`} key={i} />
              ))}
            </span>
          </span>
          <Progress prefixCls={prefixCls} percent={percent} />
        </>
      )
    }
  },
)
