<docs lang="zh-CN">
withModel HOC 验证：v-model 简写支持。5 个表单组件同时测试 v-model 和 v-model:value 的双向绑定。
</docs>

<docs lang="en-US">
withModel HOC verification: v-model shorthand support. Test both v-model and v-model:value on 5 form components.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

// v-model (modelValue) — 新写法
const inputVal = ref('')
const passwordVal = ref('')
const textareaVal = ref('')
const searchVal = ref('')
const otpVal = ref('')

// v-model:value — 旧写法
const inputVal2 = ref('')
const passwordVal2 = ref('')
const textareaVal2 = ref('')
const searchVal2 = ref('')
const otpVal2 = ref('')
</script>

<template>
  <div style="max-width: 600px;">
    <a-typography-title :level="4">
      v-model（新写法）
    </a-typography-title>
    <a-space direction="vertical" :size="16" style="width: 100%;">
      <div>
        <a-typography-text strong>
          Input
        </a-typography-text>
        <a-input v-model="inputVal" placeholder="v-model on Input" />
        <a-typography-text type="secondary">
          value: {{ JSON.stringify(inputVal) }}
        </a-typography-text>
      </div>

      <div>
        <a-typography-text strong>
          Password
        </a-typography-text>
        <a-input-password v-model="passwordVal" placeholder="v-model on Password" />
        <a-typography-text type="secondary">
          value: {{ JSON.stringify(passwordVal) }}
        </a-typography-text>
      </div>

      <div>
        <a-typography-text strong>
          TextArea
        </a-typography-text>
        <a-textarea v-model="textareaVal" placeholder="v-model on TextArea" :rows="2" />
        <a-typography-text type="secondary">
          value: {{ JSON.stringify(textareaVal) }}
        </a-typography-text>
      </div>

      <div>
        <a-typography-text strong>
          Search
        </a-typography-text>
        <a-input-search v-model="searchVal" placeholder="v-model on Search" />
        <a-typography-text type="secondary">
          value: {{ JSON.stringify(searchVal) }}
        </a-typography-text>
      </div>

      <div>
        <a-typography-text strong>
          OTP
        </a-typography-text>
        <a-input-otp v-model="otpVal" :length="6" />
        <a-typography-text type="secondary">
          value: {{ JSON.stringify(otpVal) }}
        </a-typography-text>
      </div>
    </a-space>

    <a-divider />

    <a-typography-title :level="4">
      v-model:value（旧写法 — 向后兼容）
    </a-typography-title>
    <a-space direction="vertical" :size="16" style="width: 100%;">
      <div>
        <a-typography-text strong>
          Input
        </a-typography-text>
        <a-input v-model:value="inputVal2" placeholder="v-model:value on Input" />
        <a-typography-text type="secondary">
          value: {{ JSON.stringify(inputVal2) }}
        </a-typography-text>
      </div>

      <div>
        <a-typography-text strong>
          Password
        </a-typography-text>
        <a-input-password v-model:value="passwordVal2" placeholder="v-model:value on Password" />
        <a-typography-text type="secondary">
          value: {{ JSON.stringify(passwordVal2) }}
        </a-typography-text>
      </div>

      <div>
        <a-typography-text strong>
          TextArea
        </a-typography-text>
        <a-textarea v-model:value="textareaVal2" placeholder="v-model:value on TextArea" :rows="2" />
        <a-typography-text type="secondary">
          value: {{ JSON.stringify(textareaVal2) }}
        </a-typography-text>
      </div>

      <div>
        <a-typography-text strong>
          Search
        </a-typography-text>
        <a-input-search v-model:value="searchVal2" placeholder="v-model:value on Search" />
        <a-typography-text type="secondary">
          value: {{ JSON.stringify(searchVal2) }}
        </a-typography-text>
      </div>

      <div>
        <a-typography-text strong>
          OTP
        </a-typography-text>
        <a-input-otp v-model:value="otpVal2" :length="6" />
        <a-typography-text type="secondary">
          value: {{ JSON.stringify(otpVal2) }}
        </a-typography-text>
      </div>
    </a-space>
  </div>
</template>
