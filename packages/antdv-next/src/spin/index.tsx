import type { App, SlotsType } from 'vue'
import type { VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import { classNames } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { debounce, omit } from 'es-toolkit'
import { computed, defineComponent, shallowRef, watchEffect } from 'vue'
import { getSlotPropsFnRun } from '../_util/tools.ts'
import { devUseWarning, isDev } from '../_util/warning.ts'
import { useBaseConfig, useComponentConfig } from '../config-provider/context.ts'
import Indicator from './Indicator'
import useStyle from './style/index'
import usePercent from './usePercent.ts'

const _SpinSizes = ['small', 'default', 'large'] as const
export type SpinSize = (typeof _SpinSizes)[number]

export interface SpinProps extends ComponentBaseProps {
  /** Whether Spin is spinning */
  spinning?: boolean
  /** Size of Spin, options: `small`, `default` and `large` */
  size?: SpinSize
  /** Customize description content when Spin has children */
  tip?: VueNode
  /** Specifies a delay in milliseconds for loading state (prevent flush) */
  delay?: number
  /** The className of wrapper when Spin has children */
  wrapperClassName?: string
  /** React node of the spinning indicator */
  indicator?: VueNode
  /** Display a backdrop with the `Spin` component */
  fullscreen?: boolean
  percent?: number | 'auto'
}

export interface SpinSlots {
  indicator?: () => any
  tip?: () => any
  default?: () => any
}

// Render indicator
let defaultIndicator: VueNode

function shouldDelay(spinning?: boolean, delay?: number): boolean {
  return !!spinning && !!delay && !Number.isNaN(Number(delay))
}

const defaultSpinProps = {
  spinning: true,
  delay: 0,
  size: 'default',
  tip: undefined,
  indicator: undefined,
} as any

const Spin = defineComponent<
  SpinProps,
  Record<string, any>,
  string,
  SlotsType<SpinSlots>
>(
  (props = defaultSpinProps, { slots, attrs }) => {
    const componentCtx = useComponentConfig('spin')
    const { direction, prefixCls } = useBaseConfig('spin', props)
    const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls)
    const spinning = shallowRef(shouldDelay(props.spinning, props.delay) ? false : !!props.spinning)
    const mergedPercent = usePercent(spinning, computed(() => props.percent))
    watchEffect((onCleanup) => {
      if (props.spinning) {
        const showSpinning = debounce(() => {
          spinning.value = true
        }, props.delay ?? 0)
        showSpinning()
        onCleanup(() => {
          showSpinning?.cancel?.()
        })
        return
      }
      spinning.value = false
    })

    const warning = devUseWarning('Spin')

    return () => {
      const { fullscreen, size, rootClass, wrapperClassName } = props
      const tip = getSlotPropsFnRun(slots, props, 'tip')
      const children = filterEmpty(slots?.default?.() || [])
      const contextClassName = componentCtx.value?.class
      const contextStyle = componentCtx.value?.style
      const indicator = getSlotPropsFnRun(slots, props, 'indicator')
      const contextIndicator = getSlotPropsFnRun({}, componentCtx.value, 'indicator')
      const isNestedPattern = children.length > 0 && !fullscreen
      if (isDev) {
        // 开发环境下的警告
        warning(
          !tip || isNestedPattern || !!fullscreen,
          'usage',
          '`tip` only work in nest or fullscreen pattern.',
        )
      }

      const spinClassName = classNames(
        prefixCls.value,
        contextClassName,
        {
          [`${prefixCls.value}-sm`]: size === 'small',
          [`${prefixCls.value}-lg`]: size === 'large',
          [`${prefixCls.value}-spinning`]: spinning.value,
          [`${prefixCls.value}-show-text`]: !!tip,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        (attrs as any).class,
        !fullscreen && rootClass,
        hashId.value,
        cssVarCls.value,
      )

      const containerClassName = classNames(`${prefixCls.value}-container`, {
        [`${prefixCls.value}-blur`]: spinning.value,
      })

      const mergedIndicator = indicator ?? contextIndicator ?? defaultIndicator
      const spinElement = (
        <div
          {...omit(attrs, ['class', 'style'])}
          style={[contextStyle, (attrs as any).style]}
          class={spinClassName}
          aria-live="polite"
          aria-busy={spinning.value}
        >
          <Indicator
            prefixCls={prefixCls.value}
            indicator={mergedIndicator}
            percent={mergedPercent.value as any}
          />
          {tip && (isNestedPattern || fullscreen)
            ? (
                <div class={`${prefixCls.value}-text`}>{tip}</div>
              )
            : null}
        </div>
      )
      if (isNestedPattern) {
        return wrapCSSVar(
          <div
            {...omit(attrs, ['class'])}
            class={classNames(
              `${prefixCls.value}-nested-loading`,
              wrapperClassName,
              hashId.value,
              cssVarCls.value,
            )}
          >
            {spinning.value && <div key="loading">{spinElement}</div>}
            <div class={containerClassName} key="container">
              {children}
            </div>
          </div>,
        )
      }
      if (fullscreen) {
        return wrapCSSVar(
          <div
            class={classNames(
              `${prefixCls.value}-fullscreen`,
              {
                [`${prefixCls.value}-fullscreen-show`]: spinning.value,
              },
              rootClass,
              hashId.value,
              cssVarCls.value,
            )}
          >
            {spinElement}
          </div>,
        )
      }
      return wrapCSSVar(spinElement)
    }
  },
  {
    name: 'ASpin',
    inheritAttrs: false,
  },
)

;(Spin as any).setDefaultIndicator = (indicator: VueNode) => {
  defaultIndicator = indicator
}

;(Spin as any).install = (app: App) => {
  app.component(Spin.name, Spin)
}
export default Spin as typeof Spin & {
  setDefaultIndicator: (indicator: VueNode) => void
}
