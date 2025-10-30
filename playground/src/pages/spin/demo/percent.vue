<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'

const auto = ref(false)
const percent = ref(-50)
let timerRef: ReturnType<typeof setTimeout> | null = null

const mergedPercent = computed(() => auto.value ? 'auto' : percent.value)

function updatePercent() {
  timerRef = setTimeout(() => {
    const prev = percent.value
    const nextPercent = prev + 5
    percent.value = nextPercent > 150 ? -50 : nextPercent
  }, 100)
}

watch(percent, (_n, _o, onCleanup) => {
  updatePercent()

  onCleanup(() => {
    if (timerRef) {
      clearTimeout(timerRef)
      timerRef = null
    }
  })
}, {
  immediate: true,
})

onUnmounted(() => {
  if (timerRef) {
    clearTimeout(timerRef)
    timerRef = null
  }
})

function toggleAuto() {
  auto.value = !auto.value
  percent.value = -50
}
</script>

<template>
  <a-flex align="center" gap="middle">
    <a-button @click="toggleAuto">
      {{ auto ? 'Auto: ON' : 'Auto: OFF' }}
    </a-button>
    <a-spin :percent="mergedPercent" size="small" />
    <a-spin :percent="mergedPercent" />
    <a-spin :percent="mergedPercent" size="large" />
  </a-flex>
</template>
