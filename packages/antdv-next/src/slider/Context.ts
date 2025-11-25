import type { SliderProps as VcSliderProps } from '@v-c/slider'
import type { InjectionKey, Ref } from 'vue'
import type { DirectionType } from '../config-provider/context'
import { inject, provide } from 'vue'

export interface SliderInternalContextProps {
  handleRender?: VcSliderProps['handleRender']
  direction?: Ref<DirectionType>
}

/** @private Internal context. Do not use in your production. */
const SliderInternalContextKey: InjectionKey<SliderInternalContextProps> = Symbol('SliderInternalContext')

/** @private Internal context. Do not use in your production. */
export function useSliderInternalContext() {
  return inject(SliderInternalContextKey, {} as SliderInternalContextProps)
}

export function useSliderInternalContextProvider(value: SliderInternalContextProps) {
  provide(SliderInternalContextKey, value)
}
