import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { useVModels } from '../hooks/useVModels'
import { mount } from '/@tests/utils'

// Helper: create a test component that uses useVModels with given prop name(s)
function createTestComponent(propName: string | readonly string[] = 'value') {
  return defineComponent<
    { modelValue?: any, value?: any, checked?: any, defaultValue?: any, defaultChecked?: any },
    { 'update:modelValue': (val: any) => void, 'update:value': (val: any) => void, 'update:checked': (val: any) => void }
  >(
    (props, { emit, expose }) => {
      const [resolvedValue, setValue] = useVModels(props, emit, { prop: propName })
      expose({ setValue, resolvedValue })
      return () => h('div', { onClick: () => setValue(42) }, String(resolvedValue.value))
    },
    { name: 'TestComponent', inheritAttrs: false },
  )
}

describe('useVModels', () => {
  // ===================== v-model (modelValue) =====================

  describe('v-model (modelValue)', () => {
    it('should resolve modelValue as the active value', () => {
      const Comp = createTestComponent('value')
      const wrapper = mount(Comp, { props: { modelValue: 10 } })
      expect(wrapper.text()).toBe('10')
    })

    it('should emit update:modelValue and update:value when setValue is called', async () => {
      const Comp = createTestComponent('value')
      const wrapper = mount(Comp, { props: { modelValue: 0 } })
      await wrapper.trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([42])
      expect(wrapper.emitted('update:value')).toBeTruthy()
      expect(wrapper.emitted('update:value')![0]).toEqual([42])
    })

    it('should sync when modelValue changes externally', async () => {
      const Comp = createTestComponent('value')
      const val = ref(1)
      const wrapper = mount(() => h(Comp, { modelValue: val.value }))
      expect(wrapper.text()).toBe('1')
      val.value = 99
      await nextTick()
      expect(wrapper.text()).toBe('99')
    })
  })

  // ===================== v-model:value (named v-model) =====================

  describe('v-model:value (named v-model)', () => {
    it('should resolve named prop as the active value', () => {
      const Comp = createTestComponent('value')
      const wrapper = mount(Comp, { props: { value: 20 } })
      expect(wrapper.text()).toBe('20')
    })

    it('should emit update:value (not update:modelValue) when using named prop', async () => {
      const Comp = createTestComponent('value')
      const wrapper = mount(Comp, { props: { value: 0 } })
      await wrapper.trigger('click')
      expect(wrapper.emitted('update:value')).toBeTruthy()
      expect(wrapper.emitted('update:value')![0]).toEqual([42])
      // Should NOT emit update:modelValue since modelValue was not passed
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })

    it('should sync when named prop changes externally', async () => {
      const Comp = createTestComponent('value')
      const val = ref(5)
      const wrapper = mount(() => h(Comp, { value: val.value }))
      expect(wrapper.text()).toBe('5')
      val.value = 77
      await nextTick()
      expect(wrapper.text()).toBe('77')
    })
  })

  // ===================== priority: modelValue > prop =====================

  describe('priority: modelValue > prop', () => {
    it('should prefer modelValue over named prop when both provided', () => {
      const Comp = createTestComponent('value')
      const wrapper = mount(Comp, { props: { modelValue: 100, value: 200 } })
      expect(wrapper.text()).toBe('100')
    })

    it('should emit dev warning when both provided', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const Comp = createTestComponent('value')
      mount(Comp, { props: { modelValue: 1, value: 2 } })
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Both `modelValue` and `value` are provided'),
      )
      warnSpy.mockRestore()
    })
  })

  // ===================== explicit undefined (controlled) =====================

  describe('explicit undefined (controlled)', () => {
    it('should treat modelValue={undefined} as controlled mode', () => {
      const Comp = createTestComponent('value')
      const wrapper = mount(Comp, { props: { modelValue: undefined } })
      expect(wrapper.text()).toBe('undefined')
    })
  })

  // ===================== uncontrolled (no v-model) =====================

  describe('uncontrolled (no v-model)', () => {
    it('should use options.defaultValue when no modelValue or prop is passed', () => {
      const Comp = defineComponent<
        { defaultValue?: any },
        { 'update:modelValue': (val: any) => void, 'update:value': (val: any) => void }
      >(
        (props, { emit }) => {
          const [resolvedValue, setValue] = useVModels(props, emit, {
            prop: 'value',
            defaultValue: 55,
          })
          return () => h('div', { onClick: () => setValue(99) }, String(resolvedValue.value))
        },
        { name: 'UncontrolledComp', inheritAttrs: false },
      )
      const wrapper = mount(Comp)
      expect(wrapper.text()).toBe('55')
    })

    it('should use props.defaultValue over options.defaultValue', () => {
      const Comp = defineComponent<
        { defaultValue?: any },
        { 'update:modelValue': (val: any) => void, 'update:value': (val: any) => void }
      >(
        (props, { emit }) => {
          const [resolvedValue] = useVModels(props, emit, {
            prop: 'value',
            defaultValue: 0,
          })
          return () => h('div', String(resolvedValue.value))
        },
        { name: 'DefaultPropComp', inheritAttrs: false },
      )
      const wrapper = mount(Comp, { props: { defaultValue: 88 } })
      expect(wrapper.text()).toBe('88')
    })

    it('should update internal state when setValue is called in uncontrolled mode', async () => {
      const Comp = defineComponent<
        Record<string, never>,
        { 'update:modelValue': (val: any) => void, 'update:value': (val: any) => void }
      >(
        (props, { emit }) => {
          const [resolvedValue, setValue] = useVModels(props, emit, {
            prop: 'value',
            defaultValue: 0,
          })
          return () => h('div', { onClick: () => setValue(42) }, String(resolvedValue.value))
        },
        { name: 'UncontrolledUpdateComp', inheritAttrs: false },
      )
      const wrapper = mount(Comp)
      expect(wrapper.text()).toBe('0')
      await wrapper.trigger('click')
      await nextTick()
      expect(wrapper.text()).toBe('42')
    })

    it('should not emit update:modelValue in uncontrolled mode', async () => {
      const Comp = defineComponent<
        Record<string, never>,
        { 'update:modelValue': (val: any) => void, 'update:value': (val: any) => void }
      >(
        (props, { emit }) => {
          const [resolvedValue, setValue] = useVModels(props, emit, {
            prop: 'value',
            defaultValue: 0,
          })
          return () => h('div', { onClick: () => setValue(42) }, String(resolvedValue.value))
        },
        { name: 'NoEmitComp', inheritAttrs: false },
      )
      const wrapper = mount(Comp)
      await wrapper.trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
      // Still emits update:value for consistency
      expect(wrapper.emitted('update:value')).toBeTruthy()
    })
  })

  // ===================== checked prop (Switch-like, single) =====================

  describe('checked prop (single)', () => {
    it('should work with checked as prop name', () => {
      const Comp = createTestComponent('checked')
      const wrapper = mount(Comp, { props: { checked: true } })
      expect(wrapper.text()).toBe('true')
    })

    it('should use modelValue over checked when both provided', () => {
      const Comp = createTestComponent('checked')
      const wrapper = mount(Comp, { props: { modelValue: false, checked: true } })
      expect(wrapper.text()).toBe('false')
    })

    it('should emit update:checked alongside update:modelValue', async () => {
      const Comp = createTestComponent('checked')
      const wrapper = mount(Comp, { props: { modelValue: true } })
      await wrapper.trigger('click')
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([42])
      expect(wrapper.emitted('update:checked')![0]).toEqual([42])
    })
  })

  // ===================== multi-prop alias (Switch-like) =====================

  describe('multi-prop alias', () => {
    it('should prefer first alias (checked) over second (value) when both provided', () => {
      const Comp = createTestComponent(['checked', 'value'])
      const wrapper = mount(Comp, { props: { checked: true, value: false } })
      expect(wrapper.text()).toBe('true')
    })

    it('should fall through to second alias when first is not provided', () => {
      const Comp = createTestComponent(['checked', 'value'])
      const wrapper = mount(Comp, { props: { value: 42 } })
      expect(wrapper.text()).toBe('42')
    })

    it('should emit update for ALL prop aliases', async () => {
      const Comp = createTestComponent(['checked', 'value'])
      const wrapper = mount(Comp, { props: { modelValue: true } })
      await wrapper.trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:checked')).toBeTruthy()
      expect(wrapper.emitted('update:value')).toBeTruthy()
    })

    it('should resolve defaultChecked before defaultValue', () => {
      const Comp = defineComponent<
        { defaultChecked?: any, defaultValue?: any },
        { 'update:modelValue': (val: any) => void, 'update:checked': (val: any) => void, 'update:value': (val: any) => void }
      >(
        (props, { emit }) => {
          const [resolvedValue] = useVModels(props, emit, { prop: ['checked', 'value'] })
          return () => h('div', String(resolvedValue.value))
        },
        { name: 'DefaultPriorityComp', inheritAttrs: false },
      )
      const wrapper = mount(Comp, { props: { defaultChecked: true, defaultValue: false } })
      expect(wrapper.text()).toBe('true')
    })

    it('should use defaultValue when defaultChecked is not provided', () => {
      const Comp = defineComponent<
        { defaultValue?: any },
        { 'update:modelValue': (val: any) => void, 'update:checked': (val: any) => void, 'update:value': (val: any) => void }
      >(
        (props, { emit }) => {
          const [resolvedValue] = useVModels(props, emit, { prop: ['checked', 'value'] })
          return () => h('div', String(resolvedValue.value))
        },
        { name: 'FallbackDefaultComp', inheritAttrs: false },
      )
      const wrapper = mount(Comp, { props: { defaultValue: 99 } })
      expect(wrapper.text()).toBe('99')
    })

    it('should work in uncontrolled mode with multi-prop alias', async () => {
      const Comp = defineComponent<
        Record<string, never>,
        { 'update:modelValue': (val: any) => void, 'update:checked': (val: any) => void, 'update:value': (val: any) => void }
      >(
        (props, { emit }) => {
          const [resolvedValue, setValue] = useVModels(props, emit, {
            prop: ['checked', 'value'],
            defaultValue: false,
          })
          return () => h('div', { onClick: () => setValue(true) }, String(resolvedValue.value))
        },
        { name: 'UncontrolledMultiComp', inheritAttrs: false },
      )
      const wrapper = mount(Comp)
      expect(wrapper.text()).toBe('false')
      await wrapper.trigger('click')
      await nextTick()
      expect(wrapper.text()).toBe('true')
      // Should emit update for both aliases but not modelValue
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
      expect(wrapper.emitted('update:checked')).toBeTruthy()
      expect(wrapper.emitted('update:value')).toBeTruthy()
    })
  })

  // ===================== VTU emitted() works =====================

  describe('wrapper.emitted() works correctly (no HOC boundary)', () => {
    it('should capture all emitted events via VTU wrapper.emitted()', async () => {
      const Comp = createTestComponent('value')
      const wrapper = mount(Comp, { props: { modelValue: 0 } })
      await wrapper.trigger('click')

      const emitted = wrapper.emitted()
      expect('update:modelValue' in emitted).toBe(true)
      expect('update:value' in emitted).toBe(true)
    })
  })
})
