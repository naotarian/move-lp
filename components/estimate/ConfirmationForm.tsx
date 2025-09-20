'use client'

import React, { useEffect, useState } from 'react'
import { EstimateFormData, LuggageItem } from '@/types/estimate'
import { submitEstimateForm } from '@/lib/actions/estimate'
import { getLuggageData, LuggageCategoryWithItems } from '@/lib/luggage-data'
import {
  FORM_SECTIONS,
  BUILDING_TYPE_OPTIONS,
  BUILDING_ROOM_LAYOUT_OPTIONS,
  FLOOR_OPTIONS,
  ELEVATOR_OPTIONS,
  PEOPLE_COUNT_OPTIONS,
  MOVING_DATE_TYPE_OPTIONS,
  MOVING_YEAR_MONTH_OPTIONS,
  MOVING_PERIOD_OPTIONS,
  WORK_START_TIME_TYPE_OPTIONS,
  WORK_START_TIME_OPTIONS,
} from '@/constants/estimate'

interface ConfirmationFormProps {
  formData: EstimateFormData
}

const ConfirmationForm: React.FC<ConfirmationFormProps> = ({ formData }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [luggageData, setLuggageData] = useState<LuggageCategoryWithItems[]>([])
  const [loading, setLoading] = useState(true)

  // JSONファイルから荷物データを取得
  useEffect(() => {
    const loadLuggageData = async () => {
      try {
        const data = await getLuggageData()
        setLuggageData(data)
      } catch (error) {
        console.error('Failed to load luggage data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadLuggageData()
  }, [])

  // 入力画面に戻る処理（クエリパラメータを追加）
  const handleBackToForm = () => {
    // クエリパラメータを追加して入力画面に戻る
    if (typeof window !== 'undefined') {
      window.location.href = '/estimate?from=confirmation'
    }
  }

  // オプション値をラベルに変換する関数
  const getOptionLabel = (value: string, options: readonly { value: string; label: string }[]) => {
    const option = options.find((opt) => opt.value === value)
    return option ? option.label : value
  }

  // 見積もり依頼の送信
  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Server Actionの呼び出し（成功時は自動的にリダイレクトされる）
      await submitEstimateForm(formData)

      // この行に到達した場合は何らかのエラー（リダイレクトが失敗）
      console.warn('Server Actionが完了しましたが、リダイレクトされませんでした')

      // セッションストレージをクリア
      sessionStorage.removeItem('estimateFormData')

      // 手動でthanksページに遷移（フォールバック）
      window.location.href = '/estimate/thanks'
    } catch (error) {
      console.error('送信エラー:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* 基本情報セクション */}
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-xl font-bold text-[#003672] mb-4">{FORM_SECTIONS.BASIC_INFO.title}</h2>
        <p className="text-[#5c6f8b] mb-6">{FORM_SECTIONS.BASIC_INFO.description}</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#003672] mb-2">お名前</label>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{formData.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#003672] mb-2">フリガナ</label>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{formData.nameFurigana}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#003672] mb-2">電話番号</label>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{formData.phone}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#003672] mb-2">メールアドレス</label>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{formData.email}</p>
          </div>
        </div>
      </div>

      {/* 引越し元住所セクション */}
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-xl font-bold text-[#003672] mb-4">{FORM_SECTIONS.FROM_ADDRESS.title}</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-[#003672] mb-2">住所情報</h3>
            <div className="space-y-2">
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md">〒{formData.fromZipcode}</p>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{formData.fromPrefecture}</p>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{formData.fromStreetAddress}</p>
              {formData.fromBuildingDetails && (
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{formData.fromBuildingDetails}</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-[#003672] mb-2">建物情報</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">建物のタイプ</label>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {getOptionLabel(formData.fromBuildingType, BUILDING_TYPE_OPTIONS)}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">間取り</label>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {getOptionLabel(formData.fromRoomLayout, BUILDING_ROOM_LAYOUT_OPTIONS)}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">階数</label>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {getOptionLabel(formData.fromFloor, FLOOR_OPTIONS)}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">エレベーター</label>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {getOptionLabel(formData.fromElevator, ELEVATOR_OPTIONS)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 引越し先住所セクション */}
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-xl font-bold text-[#003672] mb-4">{FORM_SECTIONS.TO_ADDRESS.title}</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-[#003672] mb-2">住所情報</h3>
            <div className="space-y-2">
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md">〒{formData.toZipcode}</p>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{formData.toPrefecture}</p>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{formData.toStreetAddress}</p>
              {formData.toBuildingDetails && (
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{formData.toBuildingDetails}</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-[#003672] mb-2">建物情報</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">建物のタイプ</label>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {getOptionLabel(formData.toBuildingType, BUILDING_TYPE_OPTIONS)}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">間取り</label>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {getOptionLabel(formData.toRoomLayout, BUILDING_ROOM_LAYOUT_OPTIONS)}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">階数</label>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {getOptionLabel(formData.toFloor, FLOOR_OPTIONS)}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">エレベーター</label>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {getOptionLabel(formData.toElevator, ELEVATOR_OPTIONS)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 人数・日程・時間セクション */}
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-xl font-bold text-[#003672] mb-4">{FORM_SECTIONS.PEOPLE_SCHEDULE_TIME.title}</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#003672] mb-2">引越し人数</label>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
              {getOptionLabel(formData.peopleCount, PEOPLE_COUNT_OPTIONS)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#003672] mb-2">引越し日</label>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-md mb-2">
              {getOptionLabel(formData.movingDateType, MOVING_DATE_TYPE_OPTIONS)}
            </p>

            {formData.movingDateType === 'undecided' && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">年月</label>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                    {getOptionLabel(formData.movingYearMonth, MOVING_YEAR_MONTH_OPTIONS)}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">期間</label>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                    {getOptionLabel(formData.movingPeriod, MOVING_PERIOD_OPTIONS)}
                  </p>
                </div>
              </div>
            )}

            {formData.movingDateType === 'decided' && formData.movingSpecificDate && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">具体的な日付</label>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {new Date(formData.movingSpecificDate).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long',
                  })}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#003672] mb-2">作業開始時間</label>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-md mb-2">
              {getOptionLabel(formData.workStartTimeType, WORK_START_TIME_TYPE_OPTIONS)}
            </p>

            {formData.workStartTimeType === 'specific' && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">時間帯</label>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {getOptionLabel(formData.workStartTime, WORK_START_TIME_OPTIONS)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* お荷物量セクション */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-[#003672] mb-4">{FORM_SECTIONS.LUGGAGE_INFO.title}</h2>

        {loading ? (
          <div className="p-4 text-center">荷物データを読み込み中...</div>
        ) : formData.luggageItems && formData.luggageItems.filter((item) => item.quantity > 0).length > 0 ? (
          <div className="space-y-8">
            {luggageData.map((category) => {
              // このカテゴリーに数量が0より大きいアイテムがあるかチェック
              const categoryItems = category.items.filter((item) => {
                const selectedItem = formData.luggageItems.find((selected) => selected.id === item.id)
                return selectedItem && selectedItem.quantity > 0
              })

              if (categoryItems.length === 0) return null

              return (
                <div key={category.id} className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#003672] border-b border-gray-200 pb-2">
                    {category.name}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryItems.map((item) => {
                      const selectedItem = formData.luggageItems.find((selected) => selected.id === item.id)
                      const quantity = selectedItem?.quantity || 0

                      return (
                        <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 break-words">{item.name}</h4>
                              {item.subLabel && <p className="text-sm text-gray-500 break-words">{item.subLabel}</p>}
                            </div>
                            <div className="bg-[#003672] text-white px-3 py-1 rounded-full text-sm font-medium flex-shrink-0">
                              数量 : {quantity}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">選択された荷物はありません</p>
        )}

        {/* 上記以外の家財 */}
        {formData.otherLuggage && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-[#003672] mb-4">上記以外の家財</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{formData.otherLuggage}</p>
            </div>
          </div>
        )}
      </div>

      {/* アクションボタン */}
      <div className="bg-gray-50 px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={handleBackToForm}
            disabled={isSubmitting}
            className="px-8 py-3 border-2 border-gray-400 text-gray-600 font-bold rounded-lg transition-all duration-150 shadow-md hover:shadow-sm hover:translate-y-0.5 hover:bg-gray-50 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-md disabled:translate-y-0"
          >
            入力内容を修正する
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-8 py-3 text-white font-bold rounded-lg transition-all duration-150 text-lg shadow-lg ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed shadow-lg translate-y-0'
                : 'bg-[#003672] hover:bg-[#5c6f8b] hover:shadow-md hover:translate-y-0.5'
            }`}
          >
            {isSubmitting ? '送信中...' : '見積もり依頼を送信'}
          </button>
        </div>
        <p className="text-sm text-[#5c6f8b] mt-4 text-center">
          送信後、複数の業者がオークション形式で入札を行います。
          <br />
          入札結果はメールでお知らせします。
          <br />
          入札の金額が安い業者3社にのみ、お客様の連絡先が開示されます。
        </p>
      </div>
    </div>
  )
}

export default ConfirmationForm
