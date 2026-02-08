import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import AutoComplete from '..'
import { mount } from '/@tests/utils'

describe('autoComplete.Semantic', () => {
  it('should support classNames and styles as functions', async () => {
    const classNamesFn = vi.fn(() => ({
      root: 'custom-autocomplete',
      prefix: 'custom-prefix',
      input: 'custom-input',
      content: 'custom-content',
      clear: 'custom-clear',
    }))

    const stylesFn = vi.fn(() => ({
      root: { backgroundColor: '#ffffff' },
      prefix: { color: 'red' },
      input: { fontSize: '14px' },
      content: { padding: '4px' },
      clear: { color: 'blue' },
    }))

    const wrapper = mount(AutoComplete, {
      props: {
        prefix: 'Icon',
        value: 'test',
        allowClear: true,
        classes: classNamesFn,
        styles: stylesFn,
      },
    })

    expect(classNamesFn).toHaveBeenCalled()
    expect(stylesFn).toHaveBeenCalled()

    // root
    const rootElement = wrapper.find('.ant-select')
    expect(rootElement.exists()).toBe(true)
    expect(rootElement.classes()).toContain('custom-autocomplete')
    expect(rootElement.attributes('style')).toContain('background-color: rgb(255, 255, 255)')

    // prefix
    const prefixElement = wrapper.find('.ant-select-prefix')
    expect(prefixElement.exists()).toBe(true)
    expect(prefixElement.classes()).toContain('custom-prefix')
    expect(prefixElement.attributes('style')).toContain('color: red')

    // input
    const inputElement = wrapper.find('.ant-select-input')
    expect(inputElement.exists()).toBe(true)
    expect(inputElement.classes()).toContain('custom-input')
    expect(inputElement.attributes('style')).toContain('font-size: 14px')

    // content
    const contentElement = wrapper.find('.ant-select-content')
    expect(contentElement.exists()).toBe(true)
    expect(contentElement.classes()).toContain('custom-content')
    expect(contentElement.attributes('style')).toContain('padding: 4px')

    // clear
    const clearElement = wrapper.find('.ant-select-clear')
    expect(clearElement.exists()).toBe(true)
    expect(clearElement.classes()).toContain('custom-clear')
    expect(clearElement.attributes('style')).toContain('color: blue')
  })

  it('should support object classNames and styles', () => {
    const wrapper = mount(AutoComplete, {
      props: {
        prefix: 'Icon',
        value: 'test',
        allowClear: true,
        classes: {
          root: 'custom-root',
          prefix: 'custom-prefix',
          input: 'custom-input',
          content: 'custom-content',
          clear: 'custom-clear',
        },
        styles: {
          root: { padding: '10px' },
          prefix: { marginRight: '8px' },
          input: { lineHeight: '1.5' },
          content: { minHeight: '100px' },
          clear: { fontSize: '16px' },
        },
      },
    })

    // root
    const rootElement = wrapper.find('.ant-select')
    expect(rootElement.exists()).toBe(true)
    expect(rootElement.classes()).toContain('custom-root')
    expect(rootElement.attributes('style')).toContain('padding: 10px')

    // prefix
    const prefixElement = wrapper.find('.ant-select-prefix')
    expect(prefixElement.exists()).toBe(true)
    expect(prefixElement.classes()).toContain('custom-prefix')
    expect(prefixElement.attributes('style')).toContain('margin-right: 8px')

    // input
    const inputElement = wrapper.find('.ant-select-input')
    expect(inputElement.exists()).toBe(true)
    expect(inputElement.classes()).toContain('custom-input')
    expect(inputElement.attributes('style')).toContain('line-height: 1.5')

    // content
    const contentElement = wrapper.find('.ant-select-content')
    expect(contentElement.exists()).toBe(true)
    expect(contentElement.classes()).toContain('custom-content')
    expect(contentElement.attributes('style')).toContain('min-height: 100px')

    // clear
    const clearElement = wrapper.find('.ant-select-clear')
    expect(clearElement.exists()).toBe(true)
    expect(clearElement.classes()).toContain('custom-clear')
    expect(clearElement.attributes('style')).toContain('font-size: 16px')
  })

  it('should support placeholder classNames and styles', () => {
    const wrapper = mount(AutoComplete, {
      props: {
        placeholder: 'Please input',
        classes: {
          placeholder: 'custom-placeholder',
        },
        styles: {
          placeholder: { color: '#999' },
        },
      },
    })

    const placeholderElement = wrapper.find('.ant-select-placeholder')
    expect(placeholderElement.exists()).toBe(true)
    expect(placeholderElement.classes()).toContain('custom-placeholder')
    expect(placeholderElement.attributes('style')).toContain('color: rgb(153, 153, 153)')
  })

  it('should support popup semantic classNames and styles', async () => {
    const wrapper = mount(AutoComplete, {
      props: {
        open: true,
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
        ],
        classes: {
          popup: {
            root: 'custom-popup-root',
            listItem: 'custom-popup-listItem',
          },
        },
        styles: {
          popup: {
            root: { maxHeight: '200px' },
            listItem: { margin: '4px' },
          },
        },
      },
      attachTo: document.body,
    })

    await nextTick()

    // popup.root
    const popupElement = document.querySelector('.ant-select-dropdown')
    expect(popupElement).toBeTruthy()
    expect(popupElement?.classList.contains('custom-popup-root')).toBe(true)
    const popupStyle = (popupElement as HTMLElement)?.style
    expect(popupStyle?.maxHeight).toBe('200px')

    // popup.listItem
    const listItems = document.querySelectorAll('.ant-select-item-option')
    expect(listItems.length).toBe(2)
    listItems.forEach((item) => {
      expect(item.classList.contains('custom-popup-listItem')).toBe(true)
      const itemStyle = (item as HTMLElement).style
      expect(itemStyle.margin).toBe('4px')
    })

    await wrapper.setProps({ open: false })
    await nextTick()
    wrapper.unmount()
  })
})
