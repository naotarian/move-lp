// 見積もりフォームの定数定義

export const TIME_SLOT_OPTIONS = [
  { value: 'morning', label: '午前中' },
  { value: 'afternoon', label: '午後' },
  { value: 'evening', label: '夕方' },
  { value: 'flexible', label: '時間指定なし' },
] as const

export const ROOM_LAYOUT_OPTIONS = [
  { value: '1R', label: '1R' },
  { value: '1K', label: '1K' },
  { value: '1DK', label: '1DK' },
  { value: '1LDK', label: '1LDK' },
  { value: '2K', label: '2K' },
  { value: '2DK', label: '2DK' },
  { value: '2LDK', label: '2LDK' },
  { value: '3K', label: '3K' },
  { value: '3DK', label: '3DK' },
  { value: '3LDK', label: '3LDK' },
  { value: '4LDK+', label: '4LDK以上' },
] as const

export const PEOPLE_COUNT_OPTIONS = [
  { value: '1', label: '単身' },
  { value: '2', label: '2人' },
  { value: '3', label: '3人' },
  { value: '4', label: '4人以上' },
] as const

export const MOVING_DATE_TYPE_OPTIONS = [
  { value: 'undecided', label: '決まっていない' },
  { value: 'decided', label: '決まっている' },
] as const

// 現在の年月から12ヶ月後までの選択肢を生成する関数
export const generateMovingYearMonthOptions = () => {
  const options = []
  const currentDate = new Date()

  for (let i = 0; i <= 12; i++) {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1)
    const year = targetDate.getFullYear()
    const month = targetDate.getMonth() + 1
    const value = `${year}-${month.toString().padStart(2, '0')}`
    const label = `${year}年${month}月`

    options.push({ value, label })
  }

  return options
}

export const MOVING_YEAR_MONTH_OPTIONS = generateMovingYearMonthOptions()

export const MOVING_PERIOD_OPTIONS = [
  { value: 'early', label: '上旬' },
  { value: 'middle', label: '中旬' },
  { value: 'late', label: '下旬' },
] as const

export const WORK_START_TIME_TYPE_OPTIONS = [
  { value: 'anytime', label: 'いつでも' },
  { value: 'specific', label: '指定する' },
] as const

export const WORK_START_TIME_OPTIONS = [
  { value: 'morning', label: '午前中' },
  { value: 'afternoon', label: '12時~15時' },
  { value: 'evening', label: '15時以降' },
] as const

export const BUILDING_TYPE_OPTIONS = [
  { value: 'mansion', label: 'マンション' },
  { value: 'apartment', label: 'アパート' },
  { value: 'house', label: '戸建て' },
  { value: 'other', label: 'その他' },
] as const

export const BUILDING_ROOM_LAYOUT_OPTIONS = [
  { value: '1R', label: 'ワンルーム' },
  { value: '1K', label: '1K' },
  { value: '1DK', label: '1DK' },
  { value: '1LDK', label: '1LDK' },
  { value: '2K', label: '2K' },
  { value: '2DK', label: '2DK' },
  { value: '2LDK', label: '2LDK' },
  { value: '3K', label: '3K' },
  { value: '3DK', label: '3DK' },
  { value: '3LDK', label: '3LDK' },
  { value: '4K', label: '4K' },
  { value: '4DK', label: '4DK' },
  { value: '4LDK', label: '4LDK' },
  { value: '5K+', label: '5K以上' },
] as const

export const FLOOR_OPTIONS = [
  { value: '1', label: '1階' },
  { value: '2', label: '2階' },
  { value: '3', label: '3階' },
  { value: '4', label: '4階' },
  { value: '5', label: '5階' },
  { value: '6', label: '6階' },
  { value: '7', label: '7階' },
  { value: '8', label: '8階' },
  { value: '9', label: '9階' },
  { value: '10', label: '10階' },
  { value: '11', label: '11階' },
  { value: '12', label: '12階' },
  { value: '13', label: '13階' },
  { value: '14', label: '14階' },
  { value: '15', label: '15階' },
  { value: '16', label: '16階' },
  { value: '17', label: '17階' },
  { value: '18', label: '18階' },
  { value: '19', label: '19階' },
  { value: '20', label: '20階' },
  { value: '21+', label: '21階以上' },
] as const

export const ELEVATOR_OPTIONS = [
  { value: 'yes', label: 'あり' },
  { value: 'no', label: 'なし' },
] as const

export const FAMILY_COMPOSITION_OPTIONS = [
  { value: 'single', label: '単身' },
  { value: 'couple', label: '夫婦' },
  { value: 'family-small', label: '家族（2-3人）' },
  { value: 'family-large', label: '家族（4人以上）' },
] as const

// 荷物データはJSONファイルから動的に取得するため、定数として定義しない
// 代わりに、lib/luggage-data.tsの関数を使用してください

export const FORM_SECTIONS = {
  BASIC_INFO: {
    title: '基本情報',
    description: '※入札上位3社にのみ公開されます',
  },
  MOVING_SCHEDULE: {
    title: '引越し予定日・時間帯',
  },
  FROM_ADDRESS: {
    title: '引越し元住所',
  },
  TO_ADDRESS: {
    title: '引越し先住所',
  },
  PEOPLE_SCHEDULE_TIME: {
    title: '人数・日程・時間',
  },
  LUGGAGE_INFO: {
    title: 'お荷物量',
  },
} as const
