// 見積もりフォームの型定義

export interface EstimateFormData {
  // 基本情報
  name: string
  nameFurigana: string
  phone: string
  email: string

  // 人数・日程・時間
  peopleCount: string
  movingDateType: string
  movingYearMonth: string
  movingPeriod: string
  movingSpecificDate: string
  workStartTimeType: string
  workStartTime: string

  // 引越し元住所
  fromZipcode: string
  fromPrefecture: string
  fromStreetAddress: string
  fromBuildingDetails: string
  fromBuildingType: string
  fromRoomLayout: string
  fromFloor: string
  fromElevator: string

  // 引越し先住所
  toZipcode: string
  toPrefecture: string
  toStreetAddress: string
  toBuildingDetails: string
  toBuildingType: string
  toRoomLayout: string
  toFloor: string
  toElevator: string

  // お荷物量
  luggageItems: LuggageItem[]
  otherLuggage: string
}

export interface LuggageItem {
  id: string
  name: string
  subLabel?: string
  quantity: number
  category: string
}

export interface AddressData {
  prefecture: string
  city: string
  address: string
}

export interface ZipcodeApiResponse {
  results?: Array<{
    address1: string
    address2: string
    address3: string
    kana1: string
    kana2: string
    kana3: string
    prefcode: string
    zipcode: string
  }>
  status: number
  message?: string
}

export interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export interface ZipcodeInputProps {
  label: string
  zipcodeValue: string
  prefectureValue: string
  streetAddressValue: string
  buildingDetailsValue: string
  onZipcodeChange: (value: string) => void
  onPrefectureChange: (value: string) => void
  onStreetAddressChange: (value: string) => void
  onBuildingDetailsChange: (value: string) => void
  onAddressSearch: () => void
  required?: boolean
  className?: string
  error?: string
  name?: string
}

export interface LargeItemCheckboxProps {
  items: readonly string[]
  selectedItems: readonly string[]
  onSelectionChange: (items: readonly string[]) => void
  className?: string
}

export interface OptionCheckboxProps {
  options: readonly string[]
  selectedOptions: readonly string[]
  onSelectionChange: (options: readonly string[]) => void
  className?: string
}
