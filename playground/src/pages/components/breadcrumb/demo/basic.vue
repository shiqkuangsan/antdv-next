<docs lang="zh-CN">
最简单的用法。
</docs>

<docs lang="en-US">
The simplest use.
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
  <a-breadcrumb :items="items" />
</template>
