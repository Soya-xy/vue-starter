import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import timezone from 'dayjs/plugin/timezone.js'
import utc from 'dayjs/plugin/utc.js'

import 'dayjs/locale/zh-cn.js'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(duration)
dayjs.extend(relativeTime)

const defaultTZ = 'Asia/Shanghai'

const tz = dayjs.tz.guess()
if (tz !== defaultTZ) {
  console.warn('调整当前时区', tz, '为默认时区', defaultTZ)
  dayjs.tz.setDefault(defaultTZ)
}
dayjs.locale('zh-cn')
