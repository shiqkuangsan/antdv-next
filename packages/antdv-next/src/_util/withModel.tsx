import type { Component } from 'vue'
import { defineComponent, h, shallowRef } from 'vue'
import { isDev } from './warning'

export interface WithModelOptions {
  /** The actual prop name used by the inner component (e.g. 'value') */
  prop: string
}

/** Props added by withModel wrapper */
export interface WithModelExtraProps {
  modelValue?: any
  'onUpdate:modelValue'?: (...args: any[]) => void
}

/**
 * HOC that adds `v-model` (modelValue) support to components that use
 * a named v-model like `v-model:value`.
 *
 * Maps `modelValue` → `options.prop` and
 * `onUpdate:modelValue` → `onUpdate:{options.prop}`.
 *
 * When both `modelValue` and the original prop are provided,
 * `modelValue` takes priority.
 */
export function withModel<C extends Component>(
  WrappedComponent: C,
  options: WithModelOptions,
): C & { new (): { $props: WithModelExtraProps } } {
  const { prop } = options

  const updateEvent = `onUpdate:${prop}` // e.g. "onUpdate:value"

  const wrapped = defineComponent({
    name: (WrappedComponent as any).name,
    inheritAttrs: false,
    setup(_, { attrs, slots, expose }) {
      const innerRef = shallowRef<any>()

      // Proxy-based expose so ref methods are forwarded transparently
      expose(new Proxy({}, {
        get(_, key) {
          return innerRef.value?.[key]
        },
        has(_, key) {
          return innerRef.value ? key in innerRef.value : false
        },
        ownKeys() {
          return innerRef.value ? Object.keys(innerRef.value) : []
        },
        getOwnPropertyDescriptor(_, key) {
          if (innerRef.value && key in innerRef.value) {
            return { configurable: true, enumerable: true, value: innerRef.value[key] }
          }
          return undefined
        },
      }))

      return () => {
        const {
          modelValue,
          'onUpdate:modelValue': onUpdateModelValue,
          ...restAttrs
        } = attrs as any

        const mergedAttrs: Record<string, any> = { ...restAttrs }

        // Map modelValue → prop (modelValue takes priority over the original prop)
        // Use `in` check to handle explicit `undefined` (controlled with no initial value)
        const hasModelValue = 'modelValue' in (attrs as any)
        if (hasModelValue) {
          if (isDev && prop in restAttrs) {
            console.warn(
              `[withModel] Both modelValue and ${prop} are provided on <${(WrappedComponent as any).name}>. `
              + `modelValue takes priority. Remove one to avoid ambiguity.`,
            )
          }
          mergedAttrs[prop] = modelValue
        }

        // Chain update handlers: fire both onUpdate:modelValue and onUpdate:value
        const originalHandler = restAttrs[updateEvent]
        if (onUpdateModelValue) {
          mergedAttrs[updateEvent] = (...args: any[]) => {
            onUpdateModelValue(...args)
            if (typeof originalHandler === 'function') {
              originalHandler(...args)
            }
          }
        }

        return h(WrappedComponent as any, { ref: innerRef, ...mergedAttrs }, slots)
      }
    },
  })

  // Copy user-defined static properties (install, sub-components, etc.)
  // Skip Vue internal keys to avoid polluting the wrapper's component options
  const VUE_INTERNAL_KEYS = new Set([
    'name',
    'setup',
    'props',
    'emits',
    'render',
    'inheritAttrs',
    'components',
    'directives',
    '__hmrId',
    '__file',
    '__name',
  ])
  for (const key of Object.keys(WrappedComponent as any)) {
    if (!VUE_INTERNAL_KEYS.has(key) && !(key in wrapped)) {
      ;(wrapped as any)[key] = (WrappedComponent as any)[key]
    }
  }

  return wrapped as unknown as C & { new (): { $props: WithModelExtraProps } }
}
