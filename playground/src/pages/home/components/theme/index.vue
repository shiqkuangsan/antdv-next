<script setup lang="ts">
import type { ThemeConfig } from 'antdv-next/config-provider/context'
import type { THEME } from './types'
import { FastColor } from '@ant-design/fast-color'
import {
  BellOutlined,
  FolderOutlined,
  HomeOutlined,
  QuestionCircleOutlined,
} from '@antdv-next/icons'
import { theme } from 'antdv-next'
import { AggregationColor } from 'antdv-next/color-picker/color'
import { storeToRefs } from 'pinia'
import { computed, h, reactive, ref, watch } from 'vue'
import logo from '@/assets/antdv-next.svg'
import { useLocale } from '@/composables/use-locale'
import { useAppStore } from '@/stores/app.ts'
import Group from '../group/index.vue'
import BackgroundImage from './background-image.vue'
import ColorPicker from './color-picker.vue'
import { DEFAULT_COLOR, getAvatarURL, getClosetColor, PINK_COLOR } from './color-util'
import RadiusPicker from './radius-picker.vue'
import ThemePicker from './theme-picker.vue'

function generateColor(color: string | { h: number, s: number, b: number }): AggregationColor {
  return new AggregationColor(color as any)
}

// ============================= Types =============================
interface ThemeData {
  themeType: THEME
  colorPrimary: string
  borderRadius: number
  compact: 'default' | 'compact'
}

// ============================= Constants =============================
const ThemeDefault: ThemeData = {
  themeType: 'default',
  colorPrimary: '#1677FF',
  borderRadius: 6,
  compact: 'default',
}

const ThemesInfo: Record<THEME, Partial<ThemeData>> = {
  default: {},
  dark: {
    borderRadius: 2,
  },
  lark: {
    colorPrimary: '#00B96B',
    borderRadius: 4,
  },
  comic: {
    colorPrimary: PINK_COLOR,
    borderRadius: 16,
  },
  v4: {},
}

// ============================= Menu Config ==========================
const subMenuItems = [
  { key: 'Design Values', label: 'Design Values' },
  { key: 'Global Styles', label: 'Global Styles' },
  { key: 'Themes', label: 'Themes' },
  { key: 'DesignPatterns', label: 'Design Patterns' },
]

const sideMenuItems = [
  {
    key: 'Design',
    label: 'Design',
    icon: () => h(FolderOutlined),
    children: subMenuItems,
  },
  {
    key: 'Development',
    label: 'Development',
    icon: () => h(FolderOutlined),
  },
]

// ============================= Utils =============================
function normalize(value: number) {
  return value / 255
}

function rgbToColorMatrix(color: string) {
  const rgb = new FastColor(color).toRgb()
  const { r, g, b } = rgb

  const invertValue = normalize(r) * 100
  const sepiaValue = 100
  const saturateValue = Math.max(normalize(r), normalize(g), normalize(b)) * 10000
  const hueRotateValue = ((Math.atan2(
    Math.sqrt(3) * (normalize(g) - normalize(b)),
    2 * normalize(r) - normalize(g) - normalize(b),
  ) * 180) / Math.PI + 360) % 360

  return `invert(${invertValue}%) sepia(${sepiaValue}%) saturate(${saturateValue}%) hue-rotate(${hueRotateValue}deg)`
}

function getTitleColor(colorPrimary: string, isLight?: boolean) {
  if (!isLight) {
    return '#FFF'
  }

  const color = generateColor(colorPrimary)
  const closestColor = getClosetColor(colorPrimary)

  switch (closestColor) {
    case DEFAULT_COLOR:
    case PINK_COLOR:
    case '#F2BD27':
      return undefined

    case '#5A54F9':
    case '#E0282E':
      return '#FFF'

    default:
      return color.toHsb().b < 0.7 ? '#FFF' : undefined
  }
}

// ============================= Setup =============================
const { t } = useLocale()

const appStore = useAppStore()
const { darkMode } = storeToRefs(appStore)

// Theme data state
const themeData = reactive<ThemeData>({ ...ThemeDefault })
const formState = ref<ThemeData>({ ...ThemeDefault })

const isLight = computed(() => themeData.themeType !== 'dark')

const colorPrimaryValue = computed(() => {
  const color = themeData.colorPrimary
  // 确保始终返回字符串格式的颜色值
  if (typeof color === 'string') {
    return color
  }
  // 如果是 AggregationColor 对象，转换为 hex 字符串
  if (color && typeof color === 'object' && 'toHexString' in color) {
    return (color as any).toHexString()
  }
  return '#1677FF'
})

const closestColor = computed(() => getClosetColor(colorPrimaryValue.value))

// ============================= Computed =============================
const algorithmFn = computed(() => {
  const algorithms = [isLight.value ? theme.defaultAlgorithm : theme.darkAlgorithm]

  if (themeData.compact === 'compact') {
    algorithms.push(theme.compactAlgorithm)
  }

  return algorithms
})

const backgroundColor = computed(() => {
  const mapToken = theme.defaultAlgorithm({
    ...theme.defaultConfig.token,
    colorPrimary: colorPrimaryValue.value,
  })

  if (themeData.themeType === 'dark') {
    return '#393F4A'
  }
  else if (closestColor.value === DEFAULT_COLOR) {
    return '#F5F8FF'
  }
  else {
    return mapToken.colorPrimaryHover
  }
})

const avatarColor = computed(() => {
  const mapToken = theme.defaultAlgorithm({
    ...theme.defaultConfig.token,
    colorPrimary: colorPrimaryValue.value,
  })
  return mapToken.colorPrimaryBgHover
})

const logoColor = computed(() => {
  const hsb = generateColor(colorPrimaryValue.value).toHsb()
  hsb.b = Math.min(hsb.b, 0.7)
  return generateColor(hsb).toHexString()
})

const titleColor = computed(() => getTitleColor(colorPrimaryValue.value, isLight.value))

const memoTheme = computed<ThemeConfig>(() => ({
  token: {
    colorPrimary: colorPrimaryValue.value,
    borderRadius: themeData.borderRadius,
  },
  algorithm: algorithmFn.value,
  components: {
    Layout: isLight.value ? { headerBg: 'transparent', bodyBg: 'transparent' } : {},
    Menu: isLight.value
      ? { itemBg: 'transparent', subMenuItemBg: 'transparent', activeBarBorderWidth: 0 }
      : {},
  },
}))

const breadcrumbItems = computed(() => [
  { title: h(HomeOutlined) },
  { title: 'Design', menu: { items: subMenuItems } },
  { title: 'Themes' },
])

const compactOptions = computed(() => [
  { label: t('homePage.theme.default'), value: 'default', id: 'compact_default' },
  { label: t('homePage.theme.compact'), value: 'compact' },
])

// ============================= Watchers =============================
function onThemeTypeChange(newThemeType: THEME) {
  const mergedData = {
    ...ThemeDefault,
    themeType: newThemeType,
    ...ThemesInfo[newThemeType],
  }
  Object.assign(themeData, mergedData)
  Object.assign(formState.value, mergedData)
}

watch(darkMode, (dark) => {
  onThemeTypeChange(dark ? 'dark' : 'default')
}, { immediate: true })

function handleFormChange(changedValues: Partial<ThemeData>) {
  if ('themeType' in changedValues && changedValues.themeType) {
    onThemeTypeChange(changedValues.themeType)
  }
  else {
    // 确保 colorPrimary 始终是字符串
    if ('colorPrimary' in changedValues && changedValues.colorPrimary) {
      const color = changedValues.colorPrimary
      if (typeof color === 'object' && 'toHexString' in color) {
        changedValues.colorPrimary = (color as any).toHexString()
      }
    }
    Object.assign(themeData, changedValues)
  }
}
</script>

<template>
  <Group
    id="flexible"
    :title="t('homePage.theme.themeTitle')"
    :title-color="titleColor"
    :description="t('homePage.theme.themeDesc')"
    :background="backgroundColor"
  >
    <template #decoration>
      <!-- >>>>>> Default <<<<<< -->
      <div
        class="antdv-theme-decoration-motion"
        :class="isLight && closestColor === DEFAULT_COLOR ? 'antdv-theme-opacity-1' : 'antdv-theme-opacity-0'"
      >
        <!-- Image Left Top -->
        <img
          draggable="false"
          class="antdv-theme-position-absolute antdv-theme-left-top-image"
          src="https://gw.alipayobjects.com/zos/bmw-prod/bd71b0c6-f93a-4e52-9c8a-f01a9b8fe22b.svg"
          alt="image-left-top"
        >
        <!-- Image Right Bottom -->
        <img
          draggable="false"
          class="antdv-theme-position-absolute antdv-theme-right-bottom-image"
          src="https://gw.alipayobjects.com/zos/bmw-prod/84ad805a-74cb-4916-b7ba-9cdc2bdec23a.svg"
          alt="image-right-bottom"
        >
      </div>
      <!-- >>>>>> Dark <<<<<< -->
      <div
        class="antdv-theme-decoration-motion"
        :class="!isLight || !closestColor ? 'antdv-theme-opacity-1' : 'antdv-theme-opacity-0'"
      >
        <!-- Image Left Top -->
        <img
          draggable="false"
          class="antdv-theme-position-absolute antdv-theme-left-top-image-pos"
          src="https://gw.alipayobjects.com/zos/bmw-prod/a213184a-f212-4afb-beec-1e8b36bb4b8a.svg"
          alt="image-left-top"
        >
        <!-- Image Right Bottom -->
        <img
          draggable="false"
          class="antdv-theme-position-absolute antdv-theme-right-bottom-pos"
          src="https://gw.alipayobjects.com/zos/bmw-prod/bb74a2fb-bff1-4d0d-8c2d-2ade0cd9bb0d.svg"
          alt="image-right-bottom"
        >
      </div>
      <!-- >>>>>> Background Image <<<<<< -->
      <BackgroundImage :is-light="isLight" :color-primary="colorPrimaryValue" />
    </template>

    <!-- Theme Demo -->
    <a-config-provider :theme="memoTheme">
      <div
        class="antdv-theme-demo"
        :class="{
          'antdv-theme-demo-other': isLight && closestColor !== DEFAULT_COLOR,
          'antdv-theme-demo-dark': !isLight,
        }"
        :style="{ borderRadius: `${themeData.borderRadius}px` }"
      >
        <a-layout class="antdv-theme-transparent-bg">
          <a-layout-header class="antdv-theme-header antdv-theme-transparent-bg" :class="{ 'antdv-theme-header-dark': !isLight }">
            <!-- Logo -->
            <div class="antdv-theme-logo">
              <div class="antdv-theme-logo-img">
                <img
                  draggable="false"
                  :src="logo"
                  :style="{
                    filter: closestColor === DEFAULT_COLOR ? undefined : rgbToColorMatrix(logoColor),
                  }"
                  alt="antdv logo"
                >
              </div>
              <h1>Antdv Next</h1>
            </div>
            <a-flex class="antdv-theme-menu" gap="middle">
              <BellOutlined />
              <QuestionCircleOutlined />
              <div
                class="antdv-theme-avatar"
                :class="{ 'antdv-theme-avatar-dark': themeData.themeType === 'dark' }"
                :style="{
                  backgroundColor: avatarColor,
                  backgroundImage: `url(${getAvatarURL(closestColor)})`,
                }"
              />
            </a-flex>
          </a-layout-header>
          <a-layout class="antdv-theme-transparent-bg" has-sider>
            <a-layout-sider class="antdv-theme-transparent-bg" :width="200">
              <a-menu
                mode="inline"
                class="antdv-theme-transparent-bg"
                :selected-keys="['Themes']"
                :open-keys="['Design']"
                style="height: 100%; border-inline-end: 0;"
                :items="sideMenuItems"
                :expand-icon="null"
              />
            </a-layout-sider>
            <a-layout class="antdv-theme-transparent-bg" style="padding: 0 24px 24px;">
              <a-breadcrumb
                style="margin: 16px 0;"
                :items="breadcrumbItems"
              />
              <a-layout-content>
                <a-typography-title :level="2">
                  {{ t('homePage.theme.customizeTheme') }}
                </a-typography-title>
                <a-card :title="t('homePage.theme.myTheme')">
                  <template #extra>
                    <a-flex gap="small">
                      <a-button href="/theme-editor">
                        {{ t('homePage.theme.toDef') }}
                      </a-button>
                      <a-button type="primary" href="/docs/vue/customize-theme">
                        {{ t('homePage.theme.toUse') }}
                      </a-button>
                    </a-flex>
                  </template>
                  <a-form
                    :model="formState"
                    :label-col="{ span: 3 }"
                    :wrapper-col="{ span: 21 }"
                    class="antdv-theme-form"
                  >
                    <a-form-item :label="t('homePage.theme.titleTheme')" name="themeType">
                      <ThemePicker
                        v-model="formState.themeType"
                        @update:model-value="(v) => handleFormChange({ themeType: v })"
                      />
                    </a-form-item>
                    <a-form-item :label="t('homePage.theme.titlePrimaryColor')" name="colorPrimary">
                      <ColorPicker
                        v-model="formState.colorPrimary"
                        @update:model-value="(v) => handleFormChange({ colorPrimary: v as string })"
                      />
                    </a-form-item>
                    <a-form-item :label="t('homePage.theme.titleBorderRadius')" name="borderRadius">
                      <RadiusPicker
                        v-model="formState.borderRadius"
                        @update:model-value="(v) => handleFormChange({ borderRadius: v ?? 6 })"
                      />
                    </a-form-item>
                    <a-form-item :label="t('homePage.theme.titleCompact')" name="compact" html-for="compact_default">
                      <a-radio-group
                        v-model:value="formState.compact"
                        :options="compactOptions"
                        @change="(e) => handleFormChange({ compact: e.target.value })"
                      />
                    </a-form-item>
                  </a-form>
                </a-card>
              </a-layout-content>
            </a-layout>
          </a-layout>
        </a-layout>
      </div>
    </a-config-provider>
  </Group>
</template>

<style>
.antdv-theme-demo {
  overflow: hidden;
  background: rgba(240, 242, 245, 0.25);
  backdrop-filter: blur(50px);
  box-shadow: 0 2px 10px 2px rgba(0, 0, 0, 0.1);
  transition: all var(--ant-motion-duration-slow);
}

.antdv-theme-demo-other {
  backdrop-filter: blur(10px);
  background: rgba(247, 247, 247, 0.5);
}

.antdv-theme-demo-dark {
  background: #000;
}

.antdv-theme-transparent-bg {
  background: transparent !important;
}

.antdv-theme-header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--ant-color-split);
  padding-inline: var(--ant-padding-lg) !important;
  height: calc(var(--ant-control-height-lg) * 1.2);
  line-height: calc(var(--ant-control-height-lg) * 1.2);
}

.antdv-theme-header-dark {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.antdv-theme-menu {
  margin-inline-start: auto;
}

.antdv-theme-logo {
  display: flex;
  align-items: center;
  column-gap: var(--ant-padding);
}

.antdv-theme-logo h1 {
  font-weight: 400;
  font-size: var(--ant-font-size-lg);
  line-height: 1.5;
  margin: 0;
}

.antdv-theme-logo-img {
  width: 30px;
  height: 30px;
  overflow: hidden;
}

.antdv-theme-logo-img img {
  width: 30px;
  height: 30px;
  vertical-align: top;
}

.antdv-theme-avatar {
  width: var(--ant-control-height);
  height: var(--ant-control-height);
  border-radius: 100%;
  background: rgba(240, 240, 240, 0.75);
  background-size: cover;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
}

.antdv-theme-avatar-dark {
  background: rgba(200, 200, 200, 0.3);
}

.antdv-theme-form {
  width: 100%;
  margin: 0 auto;
}

/* Decoration styles */
.antdv-theme-decoration-motion {
  transition: all var(--ant-motion-duration-slow);
}

.antdv-theme-opacity-1 {
  opacity: 1;
}

.antdv-theme-opacity-0 {
  opacity: 0;
}

.antdv-theme-position-absolute {
  position: absolute;
}

.antdv-theme-left-top-image {
  inset-inline-start: 50%;
  transform: translate3d(-900px, 0, 0);
  top: -100px;
  height: 500px;
}

.antdv-theme-right-bottom-image {
  inset-inline-end: 50%;
  transform: translate3d(750px, 0, 0);
  bottom: -100px;
  height: 287px;
}

.antdv-theme-left-top-image-pos {
  inset-inline-start: 0;
  top: -100px;
  height: 500px;
}

.antdv-theme-right-bottom-pos {
  inset-inline-end: 0;
  bottom: -100px;
  height: 287px;
}
</style>
