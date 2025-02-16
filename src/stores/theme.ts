export const isDark = useDark({
  selector: 'body',
  storageKey: 'theme',
})

export const toggleTheme = useToggle(isDark)
