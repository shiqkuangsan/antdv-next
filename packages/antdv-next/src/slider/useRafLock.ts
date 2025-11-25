import type { Ref } from 'vue'
import raf from '@v-c/util/dist/raf'
import { onBeforeUnmount, shallowRef } from 'vue'

export default function useRafLock(): [state: Ref<boolean>, setState: (nextState: boolean) => void] {
  const state = shallowRef(false)
  const rafRef = shallowRef<number | null>(null)
  const cleanup = () => {
    raf.cancel(rafRef.value!)
  }
  const setDelayState = (nextState: boolean) => {
    cleanup()
    if (nextState) {
      state.value = nextState
    }
    else {
      rafRef.value = raf(() => {
        state.value = nextState
      })
    }
  }

  onBeforeUnmount(() => {
    cleanup()
  })
  return [state, setDelayState]
}
