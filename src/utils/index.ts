import dayjs from 'dayjs'
import prettyBytes from 'pretty-bytes'

export const isProd = import.meta.env.PROD

export function isTrue(value: any, defaultValue: boolean = false) {
  if (typeof value === 'boolean')
    return value
  if (typeof value === 'string')
    return value === 'true'
  if (typeof value === 'number')
    return value !== 0
  return defaultValue
}


const defaultDateTimeFormat = 'YYYY-MM-DD HH:mm:ss'

export function time2str(time: any, format: string = defaultDateTimeFormat) {
  if (!time) return ''
  const t = dayjs(time)
  if (!t.isValid()) return ''
  return t.format(format)
}

export function size2str(size?: number) {
  return size === undefined ? '' : prettyBytes(size)
}

export function stake2str(stake?: number | null) {
  if (stake === undefined || stake === null || Number.isNaN(stake)) return ''
  const kilo = Math.floor(stake)
  const meters = stake - kilo
  const fixed = meters.toFixed(3)
  return `K${kilo}+${fixed.substring(2)}`
}

export function toFixed(float: number, digits: number) {
  return Number.parseFloat(float.toFixed(digits))
}
