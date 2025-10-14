import { useId } from 'vue'

const useEmptyId = () => ''

// vue > 3.3.4 useId is available
const useThemeKey = typeof useId === 'undefined' ? useEmptyId : useId
export default useThemeKey
