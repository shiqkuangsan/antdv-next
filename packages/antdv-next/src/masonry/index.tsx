import type { App } from 'vue'
import Masonry from './Masonry'

export type { MasonryEmits, MasonryProps, MasonryRef, MasonrySlots } from './Masonry'

;(Masonry as any).install = (app: App) => {
  app.component(Masonry.name, Masonry)
}

export default Masonry
