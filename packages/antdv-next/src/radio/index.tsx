import type { App } from 'vue'
import type { CheckboxOptionType } from '../checkbox'
import { withModel } from '../_util/withModel'
import Group from './group'
import Radio from './radio'
import Button from './radioButton'

export type {
  RadioChangeEvent,
  RadioEmits,
  RadioGroupEmits,
  RadioGroupOptionType,
  RadioGroupProps,
  RadioGroupSlots,
  RadioProps,
  RadioSlots,

} from './interface'

export type RadioOptionType = CheckboxOptionType
export const RadioGroup = withModel(Group, { prop: 'value' }) as typeof Group
export const RadioButton = Button

;(Radio as any).Button = Button
;(Radio as any).Group = RadioGroup
;(Radio as any).__ANT_RADIO = true

;(Radio as any).install = (app: App) => {
  app.component(Radio.name, Radio)
  app.component(Group.name, RadioGroup)
  app.component(RadioButton.name, RadioButton)
}

export default Radio
