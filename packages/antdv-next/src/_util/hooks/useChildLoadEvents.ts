// useChildLoadEvents.ts
import { onBeforeUnmount, shallowRef } from 'vue'

export type ResourceEventType = 'load' | 'error'

export interface UseChildLoadEventsOptions {
  /**
   * 是否在 bind 时立即触发一次对“已加载完成资源”的回调
   * 默认 true
   */
  triggerForAlreadyLoaded?: boolean
}

/**
 * 监听某个容器内所有“可能触发 load/error 的元素”，
 * 并把事件统一交给回调处理。
 *
 * 使用方式：
 * const { bind, clear } = useChildLoadEvents()
 * bind(containerEl, (type, el, ev) => { ... })
 */
export function useChildLoadEvents(options: UseChildLoadEventsOptions = {}) {
  const { triggerForAlreadyLoaded = true } = options

  // 当前这一次绑定对应的清理函数
  const cleanupRef = shallowRef<null | (() => void)>(null)

  const clear = () => {
    if (cleanupRef.value) {
      cleanupRef.value()
      cleanupRef.value = null
    }
  }

  const bind = (
    root: HTMLElement | null | undefined,
    callback: (type: ResourceEventType, el: Element, ev: Event | null) => void,
  ) => {
    // 先把上一次绑定清掉，避免重复绑定
    clear()

    if (!root)
      return

    // 按需调整这个选择器
    const selector
      = 'img, iframe, video, audio, script, link[rel="stylesheet"], source, embed, object'

    const elements = Array.from(root.querySelectorAll<HTMLElement>(selector))

    const cleanups: Array<() => void> = []

    for (const el of elements) {
      const handleLoad = (ev: Event) => {
        callback('load', el, ev)
      }

      const handleError = (ev: Event) => {
        callback('error', el, ev)
      }

      el.addEventListener('load', handleLoad, { once: true })
      el.addEventListener('error', handleError, { once: true })

      cleanups.push(() => {
        el.removeEventListener('load', handleLoad)
        el.removeEventListener('error', handleError)
      })

      // 处理“已经加载完成”的情况（缓存命中等）
      if (triggerForAlreadyLoaded) {
        if (el instanceof HTMLImageElement) {
          if (el.complete) {
            callback('load', el, null)
          }
        }
        else if (el instanceof HTMLVideoElement || el instanceof HTMLAudioElement) {
          // readyState >= 1 表示已经有足够的元数据
          if (el.readyState >= 1) {
            callback('load', el, null)
          }
        }
        else if (el instanceof HTMLLinkElement) {
          if (el.rel === 'stylesheet' && el.sheet) {
            callback('load', el, null)
          }
        }
        // 其他类型（script/embed/object）如果有特殊判断需求，可以按需补充
      }
    }

    cleanupRef.value = () => {
      cleanups.forEach(fn => fn())
    }
  }

  // 组件卸载自动清理
  onBeforeUnmount(clear)

  return {
    bind,
    clear,
  }
}
