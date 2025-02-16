export function useCopy() {
  const clipboard = useClipboard({ legacy: true })

  watch(clipboard.copied, (copied) => {
    if (copied) Message.success('复制成功')
  })

  return clipboard
}
