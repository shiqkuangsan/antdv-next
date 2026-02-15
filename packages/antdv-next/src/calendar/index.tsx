import type { Dayjs } from 'dayjs'
import type { App } from 'vue'
import type { CalendarMode, CalendarProps } from './generateCalendar'
import dayjsGenerateConfig from '@v-c/picker/generate/dayjs'
import { withModel } from '../_util/withModel'
import generateCalendar from './generateCalendar'

const InternalCalendar = generateCalendar<Dayjs>(dayjsGenerateConfig)

export type CalendarType = typeof InternalCalendar & {
  generateCalendar: typeof generateCalendar
}

const Calendar = withModel(InternalCalendar, { prop: 'value' }) as CalendarType

;(Calendar as CalendarType).generateCalendar = generateCalendar

;(Calendar as any).install = (app: App) => {
  app.component(InternalCalendar.name, Calendar)
}

export type { CalendarMode, CalendarProps }
export default Calendar as CalendarType
