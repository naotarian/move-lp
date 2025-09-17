import { ZipcodeApiResponse, AddressData } from '@/types/estimate'

// 郵便番号から住所を取得するAPI関数
export const fetchAddressByZipcode = async (zipcode: string): Promise<AddressData | null> => {
  try {
    const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`)
    const data: ZipcodeApiResponse = await response.json()

    if (data.results && data.results[0]) {
      const result = data.results[0]
      return {
        prefecture: result.address1,
        city: result.address2,
        address: result.address3,
      }
    }
    return null
  } catch (error) {
    console.error('住所取得エラー:', error)
    return null
  }
}

// 郵便番号をフォーマットする関数
export const formatZipcode = (value: string): string => {
  const cleanValue = value.replace(/[^\d]/g, '')
  return cleanValue.length > 3 ? cleanValue.slice(0, 3) + '-' + cleanValue.slice(3, 7) : cleanValue
}

// 郵便番号のバリデーション
export const isValidZipcode = (zipcode: string): boolean => {
  const cleanZipcode = zipcode.replace(/[^\d]/g, '')
  return cleanZipcode.length === 7
}

// 住所の完全な文字列を生成
export const formatFullAddress = (addressData: AddressData): string => {
  return `${addressData.prefecture}${addressData.city}${addressData.address}`
}
