import type { ComputedRef, ShallowRef } from 'vue'
import { computed, shallowRef } from 'vue'
import { isDev } from '../warning'

export interface UseVModelsOptions<T = any> {
  /**
   * Component's own prop name(s).
   * - Single: `'value'`, `'checked'`, `'open'`, `'activeKey'`
   * - Multiple aliases: `['checked', 'value']` — first match wins for controlled detection
   */
  prop: string | readonly string[]
  /** Fallback default value when fully uncontrolled */
  defaultValue?: T
}

export type UseVModelsReturn<T> = [
  /** Resolved value: tracks modelValue > prop(s) > defaultValue */
  resolvedValue: ComputedRef<T>,
  /** Setter: updates internal state (uncontrolled) + emits update events */
  setValue: (newVal: T, ...extraArgs: any[]) => void,
]

/**
 * Composable for v-model support with multi-prop alias.
 *
 * Detects whether the parent passed `modelValue` or the component's own prop(s),
 * and returns a resolved computed ref + setter that emits appropriate update events.
 *
 * Priority: modelValue > prop[0] > prop[1] > ... > default{Prop} > defaultValue
 *
 * @example
 * ```ts
 * // Single prop (Input, Rate, Select)
 * const [value, setValue] = useVModels(props, emit, { prop: 'value' })
 *
 * // Multi alias (Switch: checked + value)
 * const [value, setValue] = useVModels(props, emit, { prop: ['checked', 'value'] })
 * ```
 */
export function useVModels<T = any>(
  props: Record<string, any>,
  emit: (event: any, ...args: any[]) => void,
  options: UseVModelsOptions<T>,
): UseVModelsReturn<T> {
  const { prop, defaultValue } = options
  const propKeys = (Array.isArray(prop) ? [...prop] : [prop]).filter(Boolean)

  const hasModelValue = props.modelValue !== undefined
  // Find the first prop key that was actually passed by parent
  const controlledPropKey = propKeys.find(k => props[k] !== undefined)
  const hasPropValue = controlledPropKey !== undefined

  // Dev warning when both modelValue and named prop are provided
  if (isDev && hasModelValue && hasPropValue) {
    console.warn(
      `[antdv] Both \`modelValue\` and \`${controlledPropKey}\` are provided. `
      + `\`modelValue\` takes priority. Remove one to avoid ambiguity.`,
    )
  }

  // Resolve default value from props (defaultChecked, defaultValue, etc.) or options.defaultValue
  const resolveDefaultValue = (): T => {
    for (const key of propKeys) {
      const defaultPropName = `default${key.charAt(0).toUpperCase()}${key.slice(1)}`
      if (props[defaultPropName] !== undefined) {
        return props[defaultPropName]
      }
    }
    return defaultValue as T
  }

  // Internal state — only used in uncontrolled mode
  const internalValue = shallowRef<T>(resolveDefaultValue()) as ShallowRef<T>

  // Merged value: computed reads directly from props (controlled) or internal ref (uncontrolled)
  // No watch needed — computed tracks reactivity automatically, zero delay
  const mergedValue = computed<T>(() => {
    if (props.modelValue !== undefined)
      return props.modelValue
    const key = propKeys.find(k => props[k] !== undefined)
    if (key !== undefined)
      return props[key]
    return internalValue.value
  })

  const setValue = (newVal: T, ...extraArgs: any[]) => {
    // Uncontrolled: update internal state
    if (!hasModelValue && !hasPropValue) {
      internalValue.value = newVal
    }

    // Emit update:modelValue only if modelValue was passed
    if (hasModelValue) {
      emit('update:modelValue', newVal, ...extraArgs)
    }

    // Emit update:{prop} for all prop keys
    for (const key of propKeys) {
      emit(`update:${key}`, newVal, ...extraArgs)
    }
  }

  return [mergedValue, setValue]
}
