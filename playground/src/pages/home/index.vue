<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app.ts'

const locales = {
  'zh-CN': {
    slogan: '助力设计开发者「更灵活」地搭建出「更美」的产品，让用户「快乐工作」～',
    start: '开始使用',
    designLanguage: '仓库地址',
  },
  'en-US': {
    slogan:
        'Help designers/developers building beautiful products more flexible and working with happiness',
    start: 'Getting Started',
    designLanguage: 'GitHub Repo',
  },
}

const appStore = useAppStore()
const { locale } = storeToRefs(appStore)
</script>

<template>
  <div class="min-h-100vh">
    <section>
      <div class="z-1 relative">
        <img
          alt="bg"
          draggable="false"
          src="https://gw.alipayobjects.com/zos/bmw-prod/49f963db-b2a8-4f15-857a-270d771a1204.svg"
          class="top-0 inset-l-0 absolute w-240px"
        >
        <img
          alt="bg"
          draggable="false"
          src="https://gw.alipayobjects.com/zos/bmw-prod/e152223c-bcae-4913-8938-54fda9efe330.svg"
          class="bottom-120px right-40% absolute w-240px"
        >
        <div class="h-640px flex flex-col justify-center items-center relative of-hidden" style="perspective: 800px;transform: translateZ(1000px);row-gap: var(--ant-margin-xl);-webkit-box-pack: center;-webkit-box-align: center">
          <div class="">
            <div style="will-change: transform; transform: perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1);">
              <!--              <a-alert content="信息内容展示" /> -->
            </div>
          </div>
          <div class="absolute inset-0 op-1 backdrop-blur-2px transition-all transition-delay-1000 transition-ease-DEFAULT pointer-events-none " style="background-color: rgba(255, 255, 255, 0.2)" />
          <a-typography component="article" class="text-center relative z-1 px-xl" style="text-shadow: 0 0 4px var(--ant-color-bg-container),0 0 4px var(--ant-color-bg-container),0 0 4px var(--ant-color-bg-container),0 0 4px var(--ant-color-bg-container),0 0 4px var(--ant-color-bg-container)">
            <h1 class="font-900" style="font-size: calc(var(--ant-font-size-heading-2) * 2)!important; line-height: var(--ant-line-height-heading-2)!important;">
              Antdv Next
            </h1>
            <p class="text-lg! font-normal! mb-0!">
              {{ locales[locale].slogan }}
            </p>
          </a-typography>
          <a-flex gap="middle">
            <a-button type="primary" href="/components/overview" size="large">
              {{ locales[locale].start }}
            </a-button>
            <a-button href="https://github.com/antdv-next/antdv-next" target="_blank" rel="noopener noreferrer" size="large">
              {{ locales[locale].designLanguage }}
            </a-button>
          </a-flex>
          <div class="relative w-full mx-auto my-0 z-1 max-w-1200px">
            <div class="flex w-full max-w-full box-border items-stretch text-align-start min-h-178px mx-auto" style="column-gap: calc(var(--ant-padding-md) * 2);">
              <!--              -->
            </div>
          </div>
        </div>
      </div>
      <!--      -->
    </section>
  </div>
</template>
