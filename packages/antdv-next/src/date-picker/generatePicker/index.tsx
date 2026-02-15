import type { GenerateConfig } from '@v-c/picker/generate/index'
import type { AnyObject } from '../../_util/type'
import { withModel } from '../../_util/withModel'
import generateRangePicker from './generateRangePicker'
import generateSinglePicker from './generateSinglePicker'

export type {
  GenericTimePickerProps,
  PickerLocale,
  PickerProps,
  PickerPropsWithMultiple,
  RangePickerProps,
} from './interface'

function generatePicker<DateType extends AnyObject = AnyObject>(generateConfig: GenerateConfig<DateType>) {
  const { DatePicker, WeekPicker, MonthPicker, YearPicker, TimePicker, QuarterPicker }
    = generateSinglePicker(generateConfig)

  const RangePicker = generateRangePicker(generateConfig)

  type MergedDatePickerType = typeof DatePicker & {
    WeekPicker: typeof WeekPicker
    MonthPicker: typeof MonthPicker
    YearPicker: typeof YearPicker
    RangePicker: typeof RangePicker
    TimePicker: typeof TimePicker
    QuarterPicker: typeof QuarterPicker
  }

  const MergedDatePicker = withModel(DatePicker, { prop: 'value' }) as MergedDatePickerType

  MergedDatePicker.WeekPicker = withModel(WeekPicker, { prop: 'value' }) as typeof WeekPicker
  MergedDatePicker.MonthPicker = withModel(MonthPicker, { prop: 'value' }) as typeof MonthPicker
  MergedDatePicker.YearPicker = withModel(YearPicker, { prop: 'value' }) as typeof YearPicker
  MergedDatePicker.RangePicker = withModel(RangePicker, { prop: 'value' }) as typeof RangePicker
  MergedDatePicker.TimePicker = withModel(TimePicker, { prop: 'value' }) as typeof TimePicker
  MergedDatePicker.QuarterPicker = withModel(QuarterPicker, { prop: 'value' }) as typeof QuarterPicker

  return MergedDatePicker
}

export default generatePicker
