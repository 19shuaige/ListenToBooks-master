import { computed, ref } from "vue"
import { THEME_COLOR_KEY } from "../utils/constant"

export interface ThemeOption {
  name: string
  color: string
  lightColor: string
  deepColor: string
}

export const THEME_OPTIONS: ThemeOption[] = [
  { name: "海盐蓝", color: "#4F86FF", lightColor: "#EEF4FF", deepColor: "#396FE3" },
  { name: "晴空青", color: "#2EA7A0", lightColor: "#EAF9F7", deepColor: "#1E8B84" },
  { name: "暮光紫", color: "#7A67F8", lightColor: "#F2EFFF", deepColor: "#6653E8" },
  { name: "落樱粉", color: "#F56C98", lightColor: "#FFF0F6", deepColor: "#E65282" }
]

export const getSavedThemeColor = () => {
  return uni.getStorageSync(THEME_COLOR_KEY) || THEME_OPTIONS[0].color
}

export const getThemeOption = (color?: string) => {
  const targetColor = color || getSavedThemeColor()
  return THEME_OPTIONS.find(item => item.color === targetColor) || THEME_OPTIONS[0]
}

export const useTheme = () => {
  const themeColor = ref(getSavedThemeColor())
  const currentTheme = computed(() => getThemeOption(themeColor.value))

  const applyTheme = (color: string) => {
    const theme = getThemeOption(color)
    themeColor.value = theme.color
    uni.setStorageSync(THEME_COLOR_KEY, theme.color)
    uni.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: theme.deepColor
    })
  }

  return {
    themeColor,
    currentTheme,
    themeOptions: THEME_OPTIONS,
    applyTheme
  }
}
