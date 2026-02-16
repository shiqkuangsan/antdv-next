import type { Component } from 'vue'
import { describe, expect, it } from 'vitest'
import AutoComplete from '../../auto-complete'
import Calendar from '../../calendar'
import Cascader from '../../cascader'
import { CheckboxGroup } from '../../checkbox'
import DatePicker, { DateRangePicker } from '../../date-picker'
import Input from '../../input'
import InputNumber from '../../input-number'
import Mentions from '../../mentions'
import { RadioGroup } from '../../radio'
import Rate from '../../rate'
import Segmented from '../../segmented'
import Select from '../../select'
import Slider from '../../slider'
import { CheckableTagGroup } from '../../tag'
import TimePicker, { TimeRangePicker } from '../../time-picker'
import TreeSelect from '../../tree-select'
import { mount } from '/@tests/utils'

/**
 * withModel Integration Tests
 *
 * These tests verify that each real component has been correctly wrapped
 * with the withModel HOC. The HOC's internal logic (prop mapping, event
 * chaining, priority) is covered by withModel.test.tsx — here we only
 * confirm the wrapping was applied and didn't break anything.
 *
 * To add a new component, append a config entry to the `configs` array.
 */

interface ComponentTestConfig {
  /** Display name for the test */
  name: string
  /** The wrapped component */
  component: Component
  /** The prop that v-model maps to (e.g. 'value', 'checked', 'open') */
  prop: string
  /** Extra props required for mount (e.g. Segmented needs options) */
  mountProps?: Record<string, any>
  /** Static properties that should exist on the component (sub-components, constants, etc.) */
  statics?: string[]
  /** Exposed methods that should be accessible via template ref */
  exposeMethods?: string[]
}

const configs: ComponentTestConfig[] = [
  // =====================================================================
  // Category 1: Form controls — v-model → value
  // =====================================================================
  {
    name: 'Input',
    component: Input,
    prop: 'value',
    statics: ['Search', 'TextArea', 'Password', 'OTP', 'Group'],
  },
  {
    name: 'Input.Search',
    component: (Input as any).Search,
    prop: 'value',
  },
  {
    name: 'Input.TextArea',
    component: (Input as any).TextArea,
    prop: 'value',
  },
  {
    name: 'Input.Password',
    component: (Input as any).Password,
    prop: 'value',
  },
  {
    name: 'Input.OTP',
    component: (Input as any).OTP,
    prop: 'value',
  },
  {
    name: 'Select',
    component: Select,
    prop: 'value',
    statics: ['Option', 'OptGroup'],
  },
  {
    name: 'AutoComplete',
    component: AutoComplete,
    prop: 'value',
    statics: ['Option'],
  },
  {
    name: 'InputNumber',
    component: InputNumber,
    prop: 'value',
    exposeMethods: ['focus', 'blur'],
  },
  {
    name: 'Mentions',
    component: Mentions,
    prop: 'value',
    statics: ['Option', 'getMentions'],
    exposeMethods: ['focus', 'blur'],
  },
  {
    name: 'Cascader',
    component: Cascader,
    prop: 'value',
    statics: ['Panel', 'SHOW_PARENT', 'SHOW_CHILD'],
    exposeMethods: ['focus', 'blur'],
  },
  {
    name: 'Segmented',
    component: Segmented,
    prop: 'value',
    mountProps: { options: ['Option A', 'Option B'], value: 'Option A' },
  },
  {
    name: 'Slider',
    component: Slider,
    prop: 'value',
    exposeMethods: ['focus', 'blur'],
  },
  {
    name: 'Rate',
    component: Rate,
    prop: 'value',
    exposeMethods: ['focus', 'blur'],
  },
  {
    name: 'DatePicker',
    component: DatePicker,
    prop: 'value',
    statics: ['WeekPicker', 'MonthPicker', 'YearPicker', 'QuarterPicker', 'RangePicker'],
  },
  {
    name: 'DateRangePicker',
    component: DateRangePicker,
    prop: 'value',
  },
  {
    name: 'TimePicker',
    component: TimePicker,
    prop: 'value',
    statics: ['RangePicker'],
    exposeMethods: ['focus', 'blur'],
  },
  {
    name: 'TimeRangePicker',
    component: TimeRangePicker,
    prop: 'value',
    exposeMethods: ['focus', 'blur'],
  },
  {
    name: 'TreeSelect',
    component: TreeSelect,
    prop: 'value',
    statics: ['TreeNode', 'SHOW_ALL', 'SHOW_PARENT', 'SHOW_CHILD'],
    exposeMethods: ['focus', 'blur', 'scrollTo'],
  },
  {
    name: 'Calendar',
    component: Calendar,
    prop: 'value',
  },
  {
    name: 'RadioGroup',
    component: RadioGroup,
    prop: 'value',
  },
  {
    name: 'CheckboxGroup',
    component: CheckboxGroup,
    prop: 'value',
  },
  {
    name: 'CheckableTagGroup',
    component: CheckableTagGroup,
    prop: 'value',
  },

  // =====================================================================
  // Category 2: Toggle controls — v-model → checked
  // (Add configs here as components are wrapped)
  // =====================================================================

  // =====================================================================
  // Category 3: Popup controls — v-model → open
  // (Add configs here as components are wrapped)
  // =====================================================================

  // =====================================================================
  // Category 4: Navigation — v-model → activeKey / current
  // (Add configs here as components are wrapped)
  // =====================================================================

  // =====================================================================
  // Category 5: Special
  // (Add configs here as components are wrapped)
  // =====================================================================
]

describe('withModel integration', () => {
  describe.each(configs)('$name', ({ component, prop, mountProps, statics, exposeMethods }) => {
    it('renders without error', () => {
      const wrapper = mount(component as any, mountProps ? { props: mountProps } : undefined)
      expect(wrapper.exists()).toBe(true)
    })

    it('accepts modelValue prop (withModel applied)', () => {
      expect(() => {
        mount(component as any, { props: { ...mountProps, modelValue: undefined } })
      }).not.toThrow()
    })

    it(`accepts v-model:${prop} (backward compat)`, () => {
      expect(() => {
        mount(component as any, { props: { ...mountProps, [prop]: undefined } })
      }).not.toThrow()
    })

    if (statics?.length) {
      it.each(statics)('has static property: %s', (staticName) => {
        expect((component as any)[staticName]).toBeTruthy()
      })
    }

    if (exposeMethods?.length) {
      it(`exposes methods via ref: ${exposeMethods.join(', ')}`, () => {
        const wrapper = mount(component as any, mountProps ? { props: mountProps } : undefined)
        for (const method of exposeMethods) {
          expect(typeof (wrapper.vm as any)[method]).toBe('function')
        }
      })
    }
  })
})
