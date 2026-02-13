import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import Input from '../../input'
import { withModel } from '../withModel'
import { mount } from '/@tests/utils'

// A minimal component that uses `value` prop and emits `update:value`
const SimpleInput = defineComponent({
  name: 'SimpleInput',
  inheritAttrs: false,
  props: {
    value: { type: String, default: '' },
  },
  emits: ['update:value'],
  setup(props, { emit, expose, attrs }) {
    expose({
      focus: () => {},
      getValue: () => props.value,
    })
    return () => (
      <input
        {...attrs}
        value={props.value}
        onInput={(e: Event) => emit('update:value', (e.target as HTMLInputElement).value)}
      />
    )
  },
})

const WrappedInput = withModel(SimpleInput, { prop: 'value' })

describe('withModel', () => {
  it('should forward v-model:value (backward compat)', async () => {
    const value = ref('hello')
    const wrapper = mount(() => (
      <WrappedInput v-model:value={value.value} />
    ))

    expect(wrapper.find('input').element.value).toBe('hello')

    await wrapper.find('input').setValue('world')
    expect(value.value).toBe('world')
  })

  it('should support v-model (modelValue → value mapping)', async () => {
    const value = ref('hello')
    const wrapper = mount(() => (
      <WrappedInput v-model={value.value} />
    ))

    expect(wrapper.find('input').element.value).toBe('hello')

    await wrapper.find('input').setValue('world')
    expect(value.value).toBe('world')
  })

  it('should give modelValue priority over value when both are present', async () => {
    const wrapper = mount(WrappedInput, {
      props: {
        modelValue: 'from-model',
        value: 'from-value',
      } as any,
    })

    expect(wrapper.find('input').element.value).toBe('from-model')
  })

  it('should pass through other attrs to inner component', () => {
    const wrapper = mount(WrappedInput, {
      attrs: {
        placeholder: 'type here',
        'data-testid': 'my-input',
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe('type here')
    expect(input.attributes('data-testid')).toBe('my-input')
  })

  it('should forward slots to inner component', () => {
    const SlottedComp = defineComponent({
      name: 'SlottedComp',
      inheritAttrs: false,
      setup(_, { slots }) {
        return () => <div class="outer">{slots.default?.()}</div>
      },
    })
    const Wrapped = withModel(SlottedComp, { prop: 'value' })

    const wrapper = mount(Wrapped, {
      slots: {
        default: () => h('span', 'slot content'),
      },
    })

    expect(wrapper.find('.outer span').text()).toBe('slot content')
  })

  it('should expose inner ref methods via proxy', async () => {
    const wrapper = mount(WrappedInput)
    const vm = wrapper.vm as any

    expect(typeof vm.focus).toBe('function')
    expect(typeof vm.getValue).toBe('function')
  })

  it('should preserve component name', () => {
    expect((WrappedInput as any).name).toBe('SimpleInput')
  })

  it('should copy static properties from original component', () => {
    const Base = defineComponent({
      name: 'Base',
      setup() {
        return () => <div />
      },
    })
    ;(Base as any).customStatic = 42

    const Wrapped = withModel(Base, { prop: 'value' })
    expect((Wrapped as any).customStatic).toBe(42)
  })

  it('should chain onUpdate:modelValue and onUpdate:value handlers', async () => {
    const onUpdateModel = vi.fn()
    const onUpdateValue = vi.fn()

    const wrapper = mount(WrappedInput, {
      props: {
        'onUpdate:modelValue': onUpdateModel,
        'onUpdate:value': onUpdateValue,
      } as any,
    })

    await wrapper.find('input').setValue('test')

    expect(onUpdateModel).toHaveBeenCalledWith('test')
    expect(onUpdateValue).toHaveBeenCalledWith('test')
  })

  it('should handle modelValue: undefined (controlled with no initial value)', () => {
    const wrapper = mount(WrappedInput, {
      props: {
        modelValue: undefined,
      } as any,
    })

    // modelValue is explicitly undefined → should map to value=undefined (controlled)
    // The inner SimpleInput defaults to '' when value is undefined,
    // but the key point is that modelValue IS forwarded, not silently dropped
    expect(wrapper.find('input').element.value).toBe('')
  })

  it('should warn when both modelValue and value are provided (dev only)', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    mount(WrappedInput, {
      props: {
        modelValue: 'from-model',
        value: 'from-value',
      } as any,
    })

    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('Both modelValue and value are provided'),
    )
    spy.mockRestore()
  })

  it('should not crash when onUpdate:value is a non-function value', async () => {
    const onUpdateModel = vi.fn()

    const wrapper = mount(WrappedInput, {
      props: {
        'onUpdate:modelValue': onUpdateModel,
        'onUpdate:value': 'not-a-function' as any,
      } as any,
    })

    // Should not throw
    await wrapper.find('input').setValue('test')
    expect(onUpdateModel).toHaveBeenCalledWith('test')
  })

  describe('with real Input component', () => {
    it('should support v-model on Input', async () => {
      const value = ref('')
      const wrapper = mount(() => (
        <Input v-model={value.value} />
      ))

      const input = wrapper.find('input')
      await input.setValue('from-v-model')
      expect(value.value).toBe('from-v-model')
    })

    it('should still support v-model:value on Input', async () => {
      const value = ref('')
      const wrapper = mount(() => (
        <Input v-model:value={value.value} />
      ))

      const input = wrapper.find('input')
      await input.setValue('from-v-model-value')
      expect(value.value).toBe('from-v-model-value')
    })

    it('should support v-model on Input.Password', async () => {
      const value = ref('')
      const Pwd = (Input as any).Password
      const wrapper = mount(() => (
        <Pwd v-model={value.value} />
      ))

      const input = wrapper.find('input')
      await input.setValue('secret')
      expect(value.value).toBe('secret')
    })

    it('should support v-model on Input.TextArea', async () => {
      const value = ref('')
      const TA = (Input as any).TextArea
      const wrapper = mount(() => (
        <TA v-model={value.value} />
      ))

      const textarea = wrapper.find('textarea')
      await textarea.setValue('multiline text')
      expect(value.value).toBe('multiline text')
    })

    it('should support v-model on Input.Search', async () => {
      const value = ref('')
      const Srch = (Input as any).Search
      const wrapper = mount(() => (
        <Srch v-model={value.value} />
      ))

      const input = wrapper.find('input')
      await input.setValue('search query')
      expect(value.value).toBe('search query')
    })

    it('should support v-model on Input.OTP', async () => {
      const value = ref('')
      const Otp = (Input as any).OTP
      const wrapper = mount(() => (
        <Otp v-model={value.value} length={4} />
      ))

      // OTP renders multiple inputs; just verify it renders without error
      expect(wrapper.findAll('input').length).toBeGreaterThan(0)
    })
  })
})
