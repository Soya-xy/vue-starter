import dayjs from 'dayjs'

export type HyperTablePeriod = 'hour' | 'day' | 'month' | 'year' | 'minute'

export interface HyperPeriodParam {
  start?: Date
  end?: Date
  bucket?: number
}

export interface HyperDeviceParam extends HyperPeriodParam {
  device?: string
}

export function timeParam(date?: Date) {
  return date ? dayjs(date).toJSON() : undefined
}

export function makeHyperPeriod(param: HyperPeriodParam) {
  return {
    start: timeParam(param.start),
    end: timeParam(param.end),
    bucket: param.bucket && param.bucket > 1 ? param.bucket : undefined,
  }
}

export function makeHyperPeriodDevice(param: HyperDeviceParam) {
  return {
    ...makeHyperPeriod(param),
    device: param.device,
  }
}
