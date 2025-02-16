export function dict2Options(dict: any[] = []) {
  return dict.map((x: any) => ({
    value: x.id,
    label: x.name,
  }))
}
