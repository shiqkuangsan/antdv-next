<script setup lang="ts">
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const mode = ref<'single' | 'multiple'>('single')

const options = [
  { value: 'aojunhao123', label: 'aojunhao123' },
  { value: 'thinkasany', label: 'thinkasany' },
  { value: 'meet-student', label: 'meet-student' },
]

const value = computed(() => {
  if (mode.value !== 'multiple')
    return []

  return options.length > 0
    ? [options[0]!.value]
    : []
})
const locales = {
  cn: {
    'root': '根元素，包含相对定位、行内 flex 布局、光标样式、过渡动画、边框等选择器容器的基础样式',
    'prefix': '前缀元素，包含前缀内容的布局和样式',
    'content': '多选容器，包含已选项的布局、间距、换行相关样式',
    'placeholder': '占位符元素，包含占位符文本的字体样式和颜色',
    'clear': '清除按钮元素，包含清除按钮的布局、样式和交互效果',
    'input': '输入框元素，包含搜索输入框的样式、光标控制、字体继承等搜索相关样式，去除了边框样式',
    'suffix': '后缀元素，包含后缀内容的布局和样式，如清除按钮、箭头图标等',
    'item': '多选项元素，包含边框、背景、内边距、外边距样式',
    'itemContent': '多选项内容区域，包含文字的省略样式',
    'itemRemove': '多选项移除按钮，包含字体相关样式',
    'popup.root': '弹出菜单元素，包含弹出层的定位、层级、背景、边框、阴影等弹出容器样式',
    'popup.list': '弹出菜单列表元素，包含选项列表的布局、滚动、最大高度等列表容器样式',
    'popup.listItem': '弹出菜单条目元素，包含选项项的内边距、悬浮效果、选中状态、禁用状态等选项交互样式',
  },
  en: {
    'root': 'Root element with relative positioning, inline-flex layout, cursor styles, transitions, border and other basic selector container styles',
    'prefix': 'Prefix element with layout and styling for prefix content',
    'content': 'Multiple selection container with layout, spacing, and wrapping styles for selected items',
    'placeholder': 'Placeholder element with font styles and colors for placeholder text',
    'clear': 'Clear button element with layout, styling and interactive effects for clear button',
    'input': 'Input element with search input styling, cursor control, font inheritance and other search-related styles. Remove border styles',
    'suffix': 'Suffix element with layout and styling for suffix content like clear button, arrow icon, etc.',
    'item': 'Multiple selection item element with border, background, padding, and margin styles',
    'itemContent': 'Multiple selection item content area with text ellipsis styles',
    'itemRemove': 'Multiple selection item remove button with font-related styless',
    'popup.root': 'Popup element with popup layer positioning, z-index, background, border, box-shadow and other popup container styles',
    'popup.list': 'Popup list element with option list layout, scrolling, max-height and other list container styles',
    'popup.listItem': 'Popup item element with option item padding, hover effects, selected states, disabled states and other option interactive styles',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => {
  const base = [
    { name: 'root', desc: locale.value.root },
    { name: 'prefix', desc: locale.value.prefix },
    { name: 'content', desc: locale.value.content },
    { name: 'placeholder', desc: locale.value.placeholder },
    { name: 'clear', desc: locale.value.clear },
    { name: 'input', desc: locale.value.input },
    { name: 'suffix', desc: locale.value.suffix },
    { name: 'popup.root', desc: locale.value['popup.root'] },
    { name: 'popup.list', desc: locale.value['popup.list'] },
    { name: 'popup.listItem', desc: locale.value['popup.listItem'] },
  ]

  if (mode.value === 'multiple') {
    return [
      ...base,
      { name: 'item', desc: locale.value.item },
      { name: 'itemContent', desc: locale.value.itemContent },
      { name: 'itemRemove', desc: locale.value.itemRemove },
    ]
  }

  return base
})

const divRef = ref<HTMLDivElement | null>(null)
</script>

<template>
  <SemanticPreview
    component-name="Select"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div ref="divRef" :style="{ position: 'absolute', height: '200px' }">
        <div :style="{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }">
          <a-segmented v-model:value="mode" :options="['single', 'multiple']" />
        </div>
        <div :style="{ display: 'flex', flexDirection: 'column', gap: '12px' }">
          <a-select
            prefix="prefix"
            :style="{ width: '300px' }"
            :options="options"
            :value="value"
            :mode="mode === 'multiple' ? 'multiple' : undefined"
            open
            :get-popup-container="() => divRef!"
            :classes="classes"
          />
        </div>
      </div>
    </template>
  </SemanticPreview>
</template>
