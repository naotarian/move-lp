import React from 'react'
import { FormField } from '@/components/common/form-parts'
import { ButtonRadioGroup } from '@/components/ui/button-radio'
import {
  PEOPLE_COUNT_OPTIONS,
  MOVING_DATE_TYPE_OPTIONS,
  MOVING_YEAR_MONTH_OPTIONS,
  MOVING_PERIOD_OPTIONS,
  WORK_START_TIME_TYPE_OPTIONS,
  WORK_START_TIME_OPTIONS,
} from '@/constants/estimate'

interface PeopleScheduleTimeProps {
  peopleCount: string
  movingDateType: string
  movingYearMonth: string
  movingPeriod: string
  movingSpecificDate: string
  workStartTimeType: string
  workStartTime: string
  onPeopleCountChange: (value: string) => void
  onMovingDateTypeChange: (value: string) => void
  onMovingYearMonthChange: (value: string) => void
  onMovingPeriodChange: (value: string) => void
  onMovingSpecificDateChange: (value: string) => void
  onWorkStartTimeTypeChange: (value: string) => void
  onWorkStartTimeChange: (value: string) => void
  errors?: {
    peopleCount?: string
    movingDateType?: string
    movingYearMonth?: string
    movingPeriod?: string
    movingSpecificDate?: string
    workStartTimeType?: string
    workStartTime?: string
  }
  className?: string
}

const PeopleScheduleTime: React.FC<PeopleScheduleTimeProps> = ({
  peopleCount,
  movingDateType,
  movingYearMonth,
  movingPeriod,
  movingSpecificDate,
  workStartTimeType,
  workStartTime,
  onPeopleCountChange,
  onMovingDateTypeChange,
  onMovingYearMonthChange,
  onMovingPeriodChange,
  onMovingSpecificDateChange,
  onWorkStartTimeTypeChange,
  onWorkStartTimeChange,
  errors = {},
  className = '',
}) => {
  // 引越し日タイプ変更時の処理
  const handleMovingDateTypeChange = (value: string) => {
    onMovingDateTypeChange(value)

    if (value === 'undecided') {
      // 「決まっていない」に変更された場合、決まっている時の項目を初期化
      onMovingSpecificDateChange('')
    } else if (value === 'decided') {
      // 「決まっている」に変更された場合、決まっていない時の項目を初期化
      onMovingYearMonthChange('')
      onMovingPeriodChange('')
    }
  }

  // 作業開始時間タイプ変更時の処理
  const handleWorkStartTimeTypeChange = (value: string) => {
    onWorkStartTimeTypeChange(value)

    if (value === 'anytime') {
      // 「いつでも」に変更された場合、指定する時の項目を初期化
      onWorkStartTimeChange('')
    } else if (value === 'specified') {
      // 「指定する」に変更された場合、デフォルト値を設定
      onWorkStartTimeChange('morning')
    }
  }

  // 日付のフォーマット関数（曜日付き）
  const formatDateWithDay = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const days = ['日', '月', '火', '水', '木', '金', '土']
    const dayName = days[date.getDay()]
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${month}月${day}日(${dayName})`
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 引越し人数 */}
      <div>
        <label className="block text-sm font-medium text-[#003672] mb-2 cursor-pointer">
          引越し人数 <span className="text-red-500 ml-1">*</span>
        </label>
        <ButtonRadioGroup
          options={PEOPLE_COUNT_OPTIONS}
          value={peopleCount}
          onChange={onPeopleCountChange}
          name="peopleCount"
          error={errors.peopleCount}
        />
      </div>

      {/* 引越し日 */}
      <div>
        <label className="block text-sm font-medium text-[#003672] mb-2 cursor-pointer">
          引越し日 <span className="text-red-500 ml-1">*</span>
        </label>
        <ButtonRadioGroup
          options={MOVING_DATE_TYPE_OPTIONS}
          value={movingDateType}
          onChange={handleMovingDateTypeChange}
          name="movingDateType"
          error={errors.movingDateType}
        />

        {/* 決まっていない場合 */}
        {movingDateType === 'undecided' && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="引越しの年月"
              type="select"
              options={MOVING_YEAR_MONTH_OPTIONS}
              value={movingYearMonth}
              onChange={(value) => onMovingYearMonthChange(value as string)}
              name="movingYearMonth"
              required
              error={errors.movingYearMonth}
            />
            <FormField
              label="引越しの期間"
              type="select"
              options={MOVING_PERIOD_OPTIONS}
              value={movingPeriod}
              onChange={(value) => onMovingPeriodChange(value as string)}
              name="movingPeriod"
              required
              error={errors.movingPeriod}
            />
          </div>
        )}

        {/* 決まっている場合 */}
        {movingDateType === 'decided' && (
          <div className="mt-4">
            <FormField
              label="引越し日"
              type="date"
              value={movingSpecificDate}
              onChange={(value) => onMovingSpecificDateChange(value as string)}
              name="movingSpecificDate"
              required
              error={errors.movingSpecificDate}
            />
            {movingSpecificDate && (
              <p className="text-sm text-[#5c6f8b] mt-2">選択日: {formatDateWithDay(movingSpecificDate)}</p>
            )}
          </div>
        )}
      </div>

      {/* 作業開始時間 */}
      <div>
        <label className="block text-sm font-medium text-[#003672] mb-2 cursor-pointer">
          作業開始時間 <span className="text-red-500 ml-1">*</span>
        </label>
        <ButtonRadioGroup
          options={WORK_START_TIME_TYPE_OPTIONS}
          value={workStartTimeType}
          onChange={handleWorkStartTimeTypeChange}
          name="workStartTimeType"
          error={errors.workStartTimeType}
        />

        {/* 指定する場合 */}
        {workStartTimeType === 'specific' && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-[#003672] mb-2 cursor-pointer">
              時間帯 <span className="text-red-500 ml-1">*</span>
            </label>
            <ButtonRadioGroup
              options={WORK_START_TIME_OPTIONS}
              value={workStartTime}
              onChange={onWorkStartTimeChange}
              name="workStartTime"
              error={errors.workStartTime}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default PeopleScheduleTime
