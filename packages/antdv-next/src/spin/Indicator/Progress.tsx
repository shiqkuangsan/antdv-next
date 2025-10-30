import type { CSSProperties } from 'vue'
import { classNames } from '@v-c/util'
import { defineComponent, shallowRef, watch } from 'vue'

export interface ProgressProps {
  prefixCls: string
  percent: number
}

const viewSize = 100
const borderWidth = viewSize / 5
const radius = viewSize / 2 - borderWidth / 2
const circumference = radius * 2 * Math.PI
const position = 50

interface CircleProps {
  dotClassName?: string
  hasCircleCls?: boolean
}

const CustomCircle = defineComponent<CircleProps>(
  (props) => {
    return () => {
      const { dotClassName, hasCircleCls } = props
      return (
        <circle
          class={
            classNames(`${dotClassName}-circle`, {
              [`${dotClassName}-circle-bg`]: hasCircleCls,
            })
          }
          r={radius}
          cx={position}
          cy={position}
          stroke-width={borderWidth}
        />
      )
    }
  },
)

const Progress = defineComponent<ProgressProps>(
  (props) => {
    const render = shallowRef(false)
    // ==================== Visible =====================

    watch(
      () => props.percent !== 0,
      () => {
        if (props.percent !== 0) {
          render.value = true
        }
      },
      {
        immediate: true,
      },
    )
    return () => {
      const { percent, prefixCls } = props
      const dotClassName = `${prefixCls}-dot`
      const holderClassName = `${dotClassName}-holder`
      const hideClassName = `${holderClassName}-hidden`
      // ==================== Progress ====================
      const safePtg = Math.max(Math.min(percent, 100), 0)

      // ===================== Render =====================
      if (!render.value) {
        return null
      }

      const circleStyle: CSSProperties = {
        strokeDashoffset: `${circumference / 4}`,
        strokeDasharray: `${(circumference * safePtg) / 100} ${
          (circumference * (100 - safePtg)) / 100
        }`,
      }
      return (
        <span
          class={classNames(
            holderClassName,
            `${dotClassName}-progress`,
            safePtg <= 0 && hideClassName,
          )}
        >
          <svg
            viewBox={`0 0 ${viewSize} ${viewSize}`}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={safePtg}
          >
            <CustomCircle dotClassName={dotClassName} hasCircleCls />
            <CustomCircle dotClassName={dotClassName} style={circleStyle} />
          </svg>
        </span>
      )
    }
  },
)

export default Progress
