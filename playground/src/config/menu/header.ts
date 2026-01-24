import type { MenuItemType } from 'antdv-next'

export const headerItems: MenuItemType[] = [
  {
    key: '/docs/vue',
    label: '研发',
  },
  {
    key: '/components',
    label: '组件',
  },
  {
    key: '/blog',
    label: '博客',
  },
  // {
  //   key: '/docs/resources',
  //   label: '资源',
  // },
]

export const headerLocales: Record<string, {
  'zh-CN': string
  'en-US': string
}> = {
  '/docs/vue': {
    'zh-CN': '研发',
    'en-US': 'Development',
  },
  '/components': {
    'zh-CN': '组件',
    'en-US': 'Components',
  },
  '/blog': {
    'zh-CN': '博客',
    'en-US': 'Blog',
  },
  '/docs/resources': {
    'zh-CN': '资源',
    'en-US': 'Resources',
  },
}
