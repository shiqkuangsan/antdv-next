import type { App } from 'vue'
import { withModel } from '../_util/withModel'
import Group from './Group'
import InternalInput from './Input'
import InternalOTP from './OTP'
import InternalPassword from './Password'
import InternalSearch from './Search'
import InternalTextArea from './TextArea'

export type { InputGroupProps } from './Group'
export type { InputEmits, InputProps, InputRef, InputSlots } from './Input'
export type { OTPProps } from './OTP'
export type { PasswordProps } from './Password'
export type { SearchProps } from './Search'
export type { TextAreaProps, TextAreaRef } from './TextArea'

const Input = withModel(InternalInput, { prop: 'value' })
const Search = withModel(InternalSearch, { prop: 'value' })
const TextArea = withModel(InternalTextArea, { prop: 'value' })
const Password = withModel(InternalPassword, { prop: 'value' })
const OTP = withModel(InternalOTP, { prop: 'value' })

const CompoundedInput = Input

;(CompoundedInput as any).Search = Search
;(CompoundedInput as any).TextArea = TextArea
;(CompoundedInput as any).Password = Password
;(CompoundedInput as any).OTP = OTP
;(CompoundedInput as any).Group = Group

;(CompoundedInput as any).install = (app: App) => {
  app.component(InternalInput.name, CompoundedInput)
  app.component(InternalSearch.name, Search)
  app.component(InternalTextArea.name, TextArea)
  app.component(InternalPassword.name, Password)
  app.component(InternalOTP.name, OTP)
  app.component(Group.name, Group)
  return app
}

export default CompoundedInput

export {
  TextArea,
}
export const InputGroup = Group
export const InputOTP = OTP
export const InputPassword = Password
export const InputSearch = Search
