import type { App } from 'vue'
import { withModel } from '../_util/withModel'

import Checkbox from './Checkbox'

import Group from './Group'

export type { CheckboxEmits, CheckboxProps, CheckboxSlots } from './Checkbox'

export type { CheckboxGroupEmits, CheckboxGroupProps, CheckboxGroupSlots, CheckboxOptionType } from './Group'

export const CheckboxGroup = withModel(Group, { prop: 'value' }) as typeof Group
;(Checkbox as any).install = (app: App) => {
  app.component(Checkbox.name, Checkbox)
  app.component(Group.name, CheckboxGroup)
}
export default Checkbox
