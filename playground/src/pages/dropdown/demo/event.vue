<script setup lang="ts">
import type { MenuItemType } from 'antdv-next'
import { DownOutlined } from '@antdv-next/icons'

function onClick({ key }: any) {
  console.log(`Click on item ${key}`)
}

const items: MenuItemType[] = [
  {
    label: '1st menu item',
    key: '1',
  },
  {
    label: '2nd menu item',
    key: '2',
  },
  {
    label: '3rd menu item',
    key: '3',
  },
]
</script>

<template>
  <a-dropdown :menu="{ items }" @menu-click="onClick">
    <a @click.prevent>
      <a-space>
        Hover me, Click menu item
        <DownOutlined />
      </a-space>
    </a>
  </a-dropdown>
</template>
