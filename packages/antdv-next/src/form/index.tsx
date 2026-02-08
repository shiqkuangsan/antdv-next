import type { App } from 'vue'
import type { FormEmits, FormInstance, FormProps, FormSlots } from './Form'
import Form from './Form'
import FormItem from './FormItem'

export type { FormEmits, FormInstance, FormProps, FormSlots }
;(Form as any).install = (app: App) => {
  app.component(Form.name, Form)
  app.component(FormItem.name, FormItem)
}
export default Form

export {
  FormItem,
}
export type { FormItemEmits, FormItemProps, FormItemSlots } from './FormItem'
