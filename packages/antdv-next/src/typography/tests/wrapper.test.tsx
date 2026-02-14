import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Typography from '..'
import ConfigProvider from '../../config-provider'
import Base from '../Base'
import Link from '../Link'
import Paragraph from '../Paragraph'
import Text from '../Text'
import Title from '../Title'
import OriginTypography from '../Typography'
import { mount } from '/@tests/utils'

// Mock copy util
vi.mock('../../_util/copy', () => ({
  default: vi.fn().mockResolvedValue(undefined),
}))

const prefixCls = 'ant-typography'

describe('typography wrappers', () => {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  afterEach(() => {
    errorSpy.mockReset()
  })

  // ========================== Typography (container) ==========================

  describe('typography container', () => {
    it('should render article tag by default', () => {
      const wrapper = mount(OriginTypography, {
        slots: { default: () => 'content' },
      })
      expect(wrapper.find('article').exists()).toBe(true)
    })

    it('should support custom component', () => {
      const wrapper = mount(OriginTypography, {
        props: { component: 'section' },
        slots: { default: () => 'content' },
      })
      expect(wrapper.find('section').exists()).toBe(true)
    })

    it('should apply rootClass', () => {
      const wrapper = mount(OriginTypography, {
        props: { rootClass: 'my-root' },
        slots: { default: () => 'content' },
      })
      expect(wrapper.find('article').classes()).toContain('my-root')
    })

    it('should apply direction rtl', () => {
      const wrapper = mount(OriginTypography, {
        props: { direction: 'rtl' },
        slots: { default: () => 'content' },
      })
      expect(wrapper.find('article').classes()).toContain(`${prefixCls}-rtl`)
    })
  })

  // ========================== Title ==========================

  describe('title', () => {
    it('should render h1 by default', () => {
      const wrapper = mount(Title, {
        slots: { default: () => 'heading' },
      })
      expect(wrapper.find('h1').exists()).toBe(true)
    })

    it.each([1, 2, 3, 4, 5] as const)('should render h%i for level=%i', (level) => {
      const wrapper = mount(Title, {
        props: { level },
        slots: { default: () => 'heading' },
      })
      expect(wrapper.find(`h${level}`).exists()).toBe(true)
    })

    it('should fallback to h1 for invalid level', () => {
      mount(Title, {
        props: { level: 99 as any },
        slots: { default: () => 'heading' },
      })
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Title only accept `1 | 2 | 3 | 4 | 5` as `level` value.'),
      )
    })
  })

  // ========================== Text ==========================

  describe('text', () => {
    it('should render span', () => {
      const wrapper = mount(Text, {
        slots: { default: () => 'text' },
      })
      expect(wrapper.find('span').exists()).toBe(true)
    })

    it('should strip expandable and rows from ellipsis config', () => {
      mount(Text, {
        props: {
          ellipsis: { expandable: true, rows: 3 } as any,
        },
        slots: { default: () => 'text' },
      })
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('`ellipsis` do not support `expandable` or `rows` props.'),
      )
    })

    it('should not warn for boolean ellipsis', () => {
      mount(Text, {
        props: { ellipsis: true },
        slots: { default: () => 'text' },
      })
      expect(errorSpy).not.toHaveBeenCalled()
    })
  })

  // ========================== Link ==========================

  describe('link', () => {
    it('should render a tag', () => {
      const wrapper = mount(Link, {
        props: { href: 'https://example.com' },
        slots: { default: () => 'link' },
      })
      expect(wrapper.find('a').exists()).toBe(true)
    })

    it('should auto add rel="noopener noreferrer" when target="_blank"', () => {
      const wrapper = mount(Link, {
        props: { target: '_blank' },
        slots: { default: () => 'link' },
      })
      const a = wrapper.find('a')
      expect(a.attributes('rel')).toBe('noopener noreferrer')
    })

    it('should not override explicit rel', () => {
      const wrapper = mount(Link, {
        props: { target: '_blank', rel: 'nofollow' },
        slots: { default: () => 'link' },
      })
      const a = wrapper.find('a')
      expect(a.attributes('rel')).toBe('nofollow')
    })

    it('should not add rel when target is not _blank', () => {
      const wrapper = mount(Link, {
        props: { target: '_self' },
        slots: { default: () => 'link' },
      })
      const a = wrapper.find('a')
      expect(a.attributes('rel')).toBeUndefined()
    })

    it('should add ant-typography-link class for component="a"', () => {
      const wrapper = mount(Link, {
        slots: { default: () => 'link' },
      })
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain(`${prefixCls}-link`)
    })

    it('should warn if ellipsis is an object', () => {
      mount(Link, {
        props: { ellipsis: { rows: 2 } as any },
        slots: { default: () => 'link' },
      })
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('`ellipsis` only supports boolean value.'),
      )
    })
  })

  // ========================== Paragraph ==========================

  describe('paragraph', () => {
    it('should render div tag', () => {
      const wrapper = mount(Paragraph, {
        slots: { default: () => 'paragraph' },
      })
      expect(wrapper.find('div').exists()).toBe(true)
    })
  })

  // ========================== Shared Base props ==========================

  describe('base props', () => {
    it.each([
      ['secondary', `${prefixCls}-secondary`],
      ['success', `${prefixCls}-success`],
      ['warning', `${prefixCls}-warning`],
      ['danger', `${prefixCls}-danger`],
    ] as const)('type="%s" should add class %s', (type, expectedClass) => {
      const wrapper = mount(Base, {
        props: { component: 'p', type },
        slots: { default: () => 'text' },
      })
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain(expectedClass)
    })

    it('should not add type class when type is not set', () => {
      const wrapper = mount(Base, {
        props: { component: 'p' },
        slots: { default: () => 'text' },
      })
      const classes = wrapper.find(`.${prefixCls}`).classes()
      expect(classes.some(c => c.match(/ant-typography-(secondary|success|warning|danger)/))).toBe(false)
    })

    it('disabled should add disabled class', () => {
      const wrapper = mount(Base, {
        props: { component: 'p', disabled: true },
        slots: { default: () => 'text' },
      })
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain(`${prefixCls}-disabled`)
    })

    it('disabled=false should not add disabled class', () => {
      const wrapper = mount(Base, {
        props: { component: 'p', disabled: false },
        slots: { default: () => 'text' },
      })
      expect(wrapper.find(`.${prefixCls}`).classes()).not.toContain(`${prefixCls}-disabled`)
    })

    it('rootClass should be applied', () => {
      const wrapper = mount(Base, {
        props: { component: 'p', rootClass: 'custom-root' },
        slots: { default: () => 'text' },
      })
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain('custom-root')
    })

    it('component="a" should add link class', () => {
      const wrapper = mount(Base, {
        props: { component: 'a' },
        slots: { default: () => 'text' },
      })
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain(`${prefixCls}-link`)
    })

    it('should pass data-* attributes', () => {
      const wrapper = mount(Base, {
        props: { component: 'p' },
        attrs: { 'data-testid': 'my-text' },
        slots: { default: () => 'text' },
      })
      expect(wrapper.find('[data-testid="my-text"]').exists()).toBe(true)
    })
  })

  // ========================== ConfigProvider ==========================

  describe('configProvider', () => {
    it('should support direction from ConfigProvider', () => {
      const wrapper = mount({
        render() {
          return h(ConfigProvider, { direction: 'rtl' }, {
            default: () => h(Paragraph, null, { default: () => 'text' }),
          })
        },
      })
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain(`${prefixCls}-rtl`)
    })

    it('should support component-level direction over ConfigProvider', () => {
      const wrapper = mount({
        render() {
          return h(ConfigProvider, { direction: 'rtl' }, {
            default: () => h(Paragraph, { direction: 'ltr' }, { default: () => 'text' }),
          })
        },
      })
      expect(wrapper.find(`.${prefixCls}`).classes()).not.toContain(`${prefixCls}-rtl`)
    })
  })

  // ========================== Sub-component exports ==========================

  describe('namespace exports', () => {
    it('should export sub-components on Typography', () => {
      expect((Typography as any).Text).toBe(Text)
      expect((Typography as any).Link).toBe(Link)
      expect((Typography as any).Title).toBe(Title)
      expect((Typography as any).Paragraph).toBe(Paragraph)
    })
  })
})
