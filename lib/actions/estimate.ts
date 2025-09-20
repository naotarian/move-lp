'use server'

import { redirect } from 'next/navigation'
import { EstimateFormData } from '@/types/estimate'

// 見積もりフォームデータの送信処理
export async function submitEstimateForm(formData: EstimateFormData) {
  // バリデーション
  console.log(formData)
  const validationResult = validateEstimateForm(formData)
  console.log(validationResult)
  if (!validationResult.isValid) {
    return {
      success: false,
      error: 'バリデーションエラー',
      details: validationResult.errors,
    }
  }

  // データの前処理
  const processedData = processEstimateData(formData)

  // 実際のAPI呼び出し
  console.log('送信データ:', processedData)

  let apiResult = null
  let apiError = null

  try {
    // APIエンドポイントに送信
    const response = await fetch(`${process.env.API_BASE_URL!}/api/estimate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(processedData),
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    apiResult = await response.json()
    console.log('API Response:', apiResult)
  } catch (error) {
    console.error('見積もり送信エラー:', error)
    apiError = error
  }

  // API成功時は直接thanksページにリダイレクト
  if (apiResult?.success && apiResult.data?.estimate?.id) {
    redirect(`/estimate/thanks?id=${apiResult.data.estimate.id}`)
  }

  // APIエラーの場合
  if (apiError) {
    // 開発環境ではフォールバック処理
    if (process.env.NODE_ENV === 'development') {
      console.warn('開発環境: APIエラーのためフォールバック処理を実行')
      const fallbackEstimateId = `EST-${Date.now()}`
      redirect(`/estimate/thanks?id=${fallbackEstimateId}`)
    }

    return {
      success: false,
      error: 'サーバーエラーが発生しました。しばらく時間をおいて再度お試しください。',
    }
  }

  // リダイレクトが実行されなかった場合のフォールバック
  redirect('/estimate/thanks')
}

// フォームデータのバリデーション
function validateEstimateForm(data: EstimateFormData) {
  const errors: string[] = []

  // 基本情報のチェック
  if (!data.name.trim()) {
    errors.push('お名前を入力してください')
  }

  if (!data.nameFurigana.trim()) {
    errors.push('フリガナを入力してください')
  } else if (!/^[ァ-ヶー\s]+$/.test(data.nameFurigana)) {
    errors.push('フリガナはカタカナで入力してください')
  }

  if (!data.phone.trim()) {
    errors.push('電話番号を入力してください')
  } else if (!/^[\d-+()]+$/.test(data.phone)) {
    errors.push('正しい電話番号を入力してください')
  }

  if (!data.email.trim()) {
    errors.push('メールアドレスを入力してください')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('正しいメールアドレスを入力してください')
  }

  // 住所情報のチェック
  if (!data.fromZipcode.trim() || !data.fromPrefecture.trim() || !data.fromStreetAddress.trim()) {
    errors.push('引越し元住所を入力してください')
  }

  if (!data.toZipcode.trim() || !data.toPrefecture.trim() || !data.toStreetAddress.trim()) {
    errors.push('引越し先住所を入力してください')
  }

  // 建物情報のチェック
  if (!data.fromBuildingType || !data.fromRoomLayout || !data.fromFloor || !data.fromElevator) {
    errors.push('引越し元の建物情報を入力してください')
  }

  if (!data.toBuildingType || !data.toRoomLayout || !data.toFloor || !data.toElevator) {
    errors.push('引越し先の建物情報を入力してください')
  }

  // 人数・日程・時間のチェック
  if (!data.peopleCount) {
    errors.push('引越し人数を選択してください')
  }

  if (!data.movingDateType) {
    errors.push('引越し日の設定を選択してください')
  }

  if (!data.workStartTimeType) {
    errors.push('作業開始時間の設定を選択してください')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// データの前処理
function processEstimateData(data: EstimateFormData) {
  return {
    // 基本情報
    name: data.name,
    name_furigana: data.nameFurigana,
    phone: data.phone,
    email: data.email,

    // 人数・日程・時間
    people_count: parseInt(data.peopleCount, 10),
    moving_date_type: data.movingDateType,
    moving_year_month: data.movingYearMonth,
    moving_period: data.movingPeriod,
    moving_specific_date: data.movingSpecificDate,
    work_start_time_type: data.workStartTimeType,
    work_start_time: data.workStartTime,

    // 引越し元住所
    from_zipcode: data.fromZipcode,
    from_prefecture: data.fromPrefecture,
    from_street_address: data.fromStreetAddress,
    from_building_details: data.fromBuildingDetails,
    from_building_type: data.fromBuildingType,
    from_room_layout: data.fromRoomLayout,
    from_floor: data.fromFloor,
    from_elevator: data.fromElevator,

    // 引越し先住所
    to_zipcode: data.toZipcode,
    to_prefecture: data.toPrefecture,
    to_street_address: data.toStreetAddress,
    to_building_details: data.toBuildingDetails,
    to_building_type: data.toBuildingType,
    to_room_layout: data.toRoomLayout,
    to_floor: data.toFloor,
    to_elevator: data.toElevator,

    // 荷物情報の整理（数量が0より大きいもののみ、idとquantityのみ）
    luggage_items: data.luggageItems
      .filter((item) => item.quantity > 0)
      .map((item) => ({
        id: item.id,
        quantity: item.quantity,
      })),

    // その他の家財がある場合のみ追加
    ...(data.otherLuggage &&
      data.otherLuggage.trim() && {
        other_luggage: data.otherLuggage.trim(),
      }),
  }
}

// 見積もり依頼の状態確認
export async function checkEstimateStatus(estimateId: string) {
  try {
    // TODO: 実際のデータベースから状態を取得
    console.log('見積もり状態確認:', estimateId)

    return {
      success: true,
      status: 'processing', // processing, completed, error
      message: '見積もりを処理中です',
    }
  } catch (error) {
    console.error('状態確認エラー:', error)
    return {
      success: false,
      error: '状態の確認中にエラーが発生しました',
    }
  }
}
