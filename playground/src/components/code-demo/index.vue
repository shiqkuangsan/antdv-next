<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { EditOutlined, LinkOutlined } from '@antdv-next/icons'
import { storeToRefs } from 'pinia'
import demos from 'virtual:demos'
import { computed, defineAsyncComponent, shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ExpandIcon from '@/components/code-demo/expand-icon.vue'
import CodeIframe from '@/components/code-demo/iframe.vue'
import { getId } from '@/components/code-demo/utils/getId'
import ExternalLink from '@/components/icons/external-link.vue'
import { useAppStore } from '@/stores/app.ts'

defineOptions({
  name: 'Demo',
})
const { src, compact, background } = defineProps<{
  src: string
  iframe?: string
  compact?: boolean
  background?: string
}>()
const demo = computed(() => demos[src])
const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const { locale } = storeToRefs(appStore)
const description = computed(() => {
  const locales = demo.value?.locales ?? {}
  const localeData = locales[appStore.locale] || {}
  return localeData?.html ?? ''
})
const component = computed(() => typeof demo.value?.component === 'function' ? defineAsyncComponent(demo.value.component) : demo.value.component)
const id = computed(() => {
  if (!src)
    return ''
  return getId(src)
})
const showCode = shallowRef(false)

function handleShowCode() {
  showCode.value = !showCode.value
}
const active = computed(() => route.hash === `#${id.value}`)
const domRef = shallowRef<HTMLDivElement>()
function handleScroll(e: Event) {
  e.preventDefault()
  e.stopPropagation()
  router.push({
    path: route.path,
    hash: `#${id.value}`,
  })
}
const locales = {
  'en-Us': {
    action: {
      externalLink: 'Open in new window',
      expandCode: 'Expand Code',
      expandedCode: 'Collapse Code',
    },
  },
  'zh-CN': {
    action: {
      externalLink: '在新窗口打开',
      expandCode: '展开代码',
      expandedCode: '收起代码',
    },
  },
}

const demoStyle = computed(() => {
  const styles: CSSProperties = {}
  if (compact) {
    styles.padding = '0px'
    styles.overflow = 'hidden'
  }
  if (background) {
    if (background === 'grey') {
      styles.backgroundColor = 'var(--ant-color-bg-layout)'
    }
  }
  return styles
})
</script>

<template>
  <section :id="id" ref="domRef" class="ant-doc-demo-box border-1 border-solid border-color-split" :class="active ? 'border-primary' : ''">
    <section v-if="!iframe" class="vp-raw ant-doc-demo-box-demo" :style="demoStyle">
      <Suspense>
        <component :is="component" v-if="demo?.component" />
        <template #fallback>
          <a-skeleton :paragraph="{ rows: 5 }" />
        </template>
      </Suspense>
    </section>
    <template v-else>
      <CodeIframe :src="id" :height="iframe" />
    </template>
    <section class="ant-doc-demo-box-meta markdown">
      <div class="ant-doc-demo-box-title">
        <a :href="`#${id}`" @click="handleScroll">
          <slot />
        </a>
        <a target="_blank" rel="noopener norreferrer" class="ml-xs">
          <EditOutlined class="color-text-tertiary" />
        </a>
      </div>
      <div v-if="description" class="pt-18px pb-24px px-12px ant-doc-demo-box-meta-description">
        <div v-html="description" />
      </div>
      <a-flex class="ant-doc-demo-box-actions " wrap gap="middle">
        <a class="ant-doc-demo-box-code-action">
          <LinkOutlined />
        </a>
        <a class="ant-doc-demo-box-code-action" :href="`/~demos/${id}`" target="_blank" rel="noopener norreferrer">
          <a-tooltip :title="locales[locale]?.action?.externalLink || 'Open in new window'">
            <ExternalLink />
          </a-tooltip>
        </a>
        <div class="ant-doc-demo-box-expand-icon ant-doc-demo-box-code-action" @click="handleShowCode">
          <a-tooltip :title="locales[locale]?.action?.[showCode ? 'expandedCode' : 'expandCode'] || (showCode ? 'Collapse Code' : 'Expand Code')">
            <ExpandIcon :expanded="showCode" />
          </a-tooltip>
        </div>
      </a-flex>
    </section>
    <div v-if="showCode" class="ant-doc-demo-box-code" v-html="demo?.html" />
  </section>
</template>

<style lang="less">
.ant-doc-demo-box {
  @apply bg-container;

  break-inside: avoid;
  display: flow-root;
  border-radius: 8px;
  transition: 0.2s;
  box-sizing: border-box;
  position: relative;

  &-demo {
    @apply bg-container;
    padding: 42px 24px 50px;
    border-radius: 8px 8px 0 0;
    border-bottom: 1px solid rgba(5, 5, 5, 0.06);
  }

  &-meta.markdown {
    position: relative;
    width: 100%;
    font-size: 14px;
    border-radius: 0 0 6px 6px;
    transition: background-color 0.4s;

    h4,
    p {
      margin: 0;
    }
  }

  &-title {
    @apply ml-16px;
    background-color: var(--ant-color-bg-container);
    position: absolute;
    top: -16px;
    padding: 1px 8px;
    border-radius: 6px 6px 0 0;
    transition: background-color 0.4s;

    a {
      @apply color-text! decoration-none! font-500! text-16px!;
    }
  }

  &-actions {
    display: flex;
    justify-content: center;
    padding: 12px 0;
    border-top: 1px dashed rgba(5, 5, 5, 0.06);
    opacity: 0.7;
    transition: opacity 0.3s;

    .ant-doc-demo-box-code-action {
      position: relative;
      display: flex;
      align-items: center;
      width: 16px;
      height: 16px;
      @apply color-text-secondary;
      cursor: pointer;
      transition: 0.24s;
    }
  }

  &-code {
    line-height: 2;
    padding: var(--ant-padding-sm) var(--ant-padding);
    border-top: 1px solid var(--ant-color-split);
  }
}
</style>
