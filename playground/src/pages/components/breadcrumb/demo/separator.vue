<docs lang="zh-CN">
使用 `separator=">"` 可以自定义分隔符。
</docs>

<docs lang="en-US">
The separator can be customized by setting the separator property: `separator=">"`.
</docs>

<script setup lang="ts">
const items = [
  {
    title: 'Home',
  },
  {
    title: 'Application Center',
    href: '',
  },
  {
    title: 'Application List',
    href: '',
  },
  {
    title: 'An Application',
  },
]
</script>

<template>
  <a-breadcrumb separator=">" :items="items" />
</template>
