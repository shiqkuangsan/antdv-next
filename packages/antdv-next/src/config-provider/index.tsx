import type { SlotsType } from 'vue'
import type { ConfigConsumerProps } from './context'
import type {
  ConfigProviderEmits,
  ConfigProviderProps,
  ConfigProviderSlots,
} from './define.ts'
import {
  computed,
  defineComponent,
} from 'vue'
import { defaultIconPrefixCls, useConfig } from './context'
import { useTheme } from './hooks/useTheme.ts'
import useStyle from './style'

interface ProviderChildrenProps extends ConfigProviderProps {
  parentContext: ConfigConsumerProps
  // legacyLocale: Locale;
}

const ProviderChildren = defineComponent<
  ProviderChildrenProps,
  ConfigProviderEmits,
  string,
  SlotsType<ConfigProviderSlots>
>(
  (props, { slots }) => {
    const theme = computed(() => props.theme)
    const parentTheme = computed(() => props.parentContext?.theme)
    // =================================== Context ===================================
    const getPrefixCls = (suffixCls: string, customizePrefixCls?: string) => {
      const { prefixCls, parentContext } = props

      if (customizePrefixCls) {
        return customizePrefixCls
      }

      const mergedPrefixCls = prefixCls || parentContext.getPrefixCls('')

      return suffixCls ? `${mergedPrefixCls}-${suffixCls}` : mergedPrefixCls
    }
    const iconPrefixCls = computed(() => props.iconPrefixCls ?? props?.parentContext?.iconPrefixCls ?? defaultIconPrefixCls)
    const csp = computed(() => props.csp ?? props?.parentContext?.csp)
    useStyle(iconPrefixCls, csp)

    const mergedTheme = useTheme(theme, parentTheme, computed(() => {
      return {
        prefixCls: getPrefixCls(''),
      }
    }))
    return () => {
      return slots?.default?.()
    }
  },
  {
    inheritAttrs: false,
  },
)

const ConfigProvider = defineComponent<
  ConfigProviderProps,
  ConfigProviderEmits,
  string,
  SlotsType<ConfigProviderSlots>
>(
  (props, { slots }) => {
    const context = useConfig()
    return () => {
      return <ProviderChildren parentContext={context.value} {...props} v-slots={slots} />
    }
  },
)

export default ConfigProvider
