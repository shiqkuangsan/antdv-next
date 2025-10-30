import type { CSSProperties, SlotsType, VNodeChild } from 'vue'
import type { VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import type { FormatConfig, valueType } from './utils.ts'
import { classNames } from '@v-c/util'
import pickAttrs from '@v-c/util/dist/pickAttrs'
import { defineComponent, shallowRef } from 'vue'
import { getSlotPropsFnRun } from '../_util/tools.ts'
import { useBaseConfig, useComponentConfig } from '../config-provider/context.ts'
import Skeleton from '../skeleton'
import StatisticNumber from './Number.tsx'
import useStyle from './style'

type StatisticRectProps = FormatConfig & ComponentBaseProps & {
  value?: valueType
  valueStyle?: CSSProperties
  valueRender?: (node: any) => VNodeChild
  title?: VueNode
  prefix?: VueNode
  suffix?: VueNode
  loading?: boolean
}

export type StatisticProps = StatisticRectProps

export interface StatisticEmits {
  mouseenter: (e: MouseEvent) => void
  mouseleave: (e: MouseEvent) => void
  [key: string]: (...args: any[]) => void
}

export interface StatisticSlots {
  default: () => any
  title: () => any
  prefix: () => any
  suffix: () => any
}

const defaults = {
  value: 0,
  decimalSeparator: '.',
  groupSeparator: ',',
  loading: false,
  title: undefined,
  suffix: undefined,
  prefix: undefined,
} as any

const Statistic = defineComponent<
  StatisticProps,
  StatisticEmits,
  string,
  SlotsType<StatisticSlots>
>(
  (props = defaults, { slots, attrs, emit, expose }) => {
    const { direction, prefixCls } = useBaseConfig('statistic', props)
    const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls)
    const compCtx = useComponentConfig('statistic')
    const internalRef = shallowRef<HTMLDivElement>()
    expose({
      nativeElement: internalRef,
    })
    const handleMouseEnter = (e: MouseEvent) => {
      emit('mouseenter', e)
    }
    const handleMouseLeave = (e: MouseEvent) => {
      emit('mouseleave', e)
    }
    return () => {
      const {
        decimalSeparator,
        groupSeparator,
        formatter,
        precision,
        value,
        rootClass,
        loading,
        valueStyle,
        valueRender,
      } = props
      const contextClassName = compCtx.value?.class
      const contextStyle = compCtx.value?.style
      const title = getSlotPropsFnRun(slots, props, 'title')
      const prefix = getSlotPropsFnRun(slots, props, 'prefix')
      const suffix = getSlotPropsFnRun(slots, props, 'suffix')
      const valueNode = (
        <StatisticNumber
          decimalSeparator={decimalSeparator}
          groupSeparator={groupSeparator}
          prefixCls={prefixCls.value}
          formatter={formatter}
          precision={precision}
          value={value!}
        />
      )

      const cls = classNames(
        prefixCls.value,
        {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        contextClassName,
        (attrs as any).class,
        rootClass,
        hashId.value,
        cssVarCls.value,
      )
      const restProps = pickAttrs(attrs, { data: true, aria: true })
      return wrapCSSVar(
        <div
          {...restProps}
          ref={internalRef}
          class={cls}
          style={[contextStyle, (attrs as any).style]}
          onMouseenter={handleMouseEnter}
          onMouseleave={handleMouseLeave}
        >
          {!!title && <div class={`${prefixCls.value}-title`}>{title}</div>}
          <Skeleton paragraph={false} loading={loading} class={`${prefixCls.value}-skeleton`} active>
            <div style={valueStyle} class={`${prefixCls.value}-content`}>
              {!!prefix && <span class={`${prefixCls.value}-content-prefix`}>{prefix}</span>}
              {valueRender ? valueRender(valueNode) : valueNode}
              {!!suffix && <span class={`${prefixCls.value}-content-suffix`}>{suffix}</span>}
            </div>
          </Skeleton>
        </div>,
      )
    }
  },
  {
    name: 'AStatistic',
    inheritAttrs: false,
  },
)

export default Statistic
