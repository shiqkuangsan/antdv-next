<docs lang="zh-CN">
带有路由参数的。
</docs>

<docs lang="en-US">
With route params.
</docs>

<script setup lang="ts">
import type { BreadcrumbItemType } from 'antdv-next'

const items: BreadcrumbItemType[] = [
  {
    title: 'Users',
  },
  {
    title: ':id',
    href: '',
  },
]
</script>

<template>
  <a-breadcrumb :items="items" :params="{ id: 1 }" />
</template>
