'use client'

import React from 'react'
import {
  FormField,
  FormSection,
  ZipcodeInput,
  BuildingInfo,
  PeopleScheduleTime,
  LuggageSelector,
} from '@/components/common/form-parts'
import AutoRestoreModal from '@/components/common/AutoRestoreModal'
import { useEstimateForm } from '@/hooks/useEstimateForm'
import { FORM_SECTIONS } from '@/constants/estimate'
import { fetchAddressByZipcode, formatZipcode, isValidZipcode, formatFullAddress } from '@/utils/zipcode'

const EstimateForm: React.FC = () => {
  // 開発環境フラグ（クライアントサイドでのみ判定）
  const [isDevelopment, setIsDevelopment] = React.useState(false)

  React.useEffect(() => {
    setIsDevelopment(process.env.NEXT_PUBLIC_APP_ENV === 'local')
  }, [])

  // フォーム管理フックの使用
  const {
    formData,
    errors,
    isSubmitting,
    updateField,
    updateLuggageQuantity,
    validateForm,
    resetForm,
    loadTestData,
    loadInvalidData,
    navigateToConfirmation,
    // 自動復元関連
    showAutoRestoreModal,
    handleAutoRestoreAccept,
    handleAutoRestoreDecline,
  } = useEstimateForm(isDevelopment)

  // 初期化状態を管理
  const [isInitialized, setIsInitialized] = React.useState(false)

  React.useEffect(() => {
    // フォームデータが初期化されたら表示可能にする
    if (formData) {
      setIsInitialized(true)
    }
  }, [formData])

  // 郵便番号入力の処理（引越し元）
  const handleFromZipcodeChange = async (zipcode: string) => {
    const formatted = formatZipcode(zipcode)
    updateField('fromZipcode', formatted)

    if (isValidZipcode(zipcode)) {
      const addressData = await fetchAddressByZipcode(zipcode)
      if (addressData) {
        updateField('fromPrefecture', formatFullAddress(addressData))
      }
    }
  }

  // 郵便番号入力の処理（引越し先）
  const handleToZipcodeChange = async (zipcode: string) => {
    const formatted = formatZipcode(zipcode)
    updateField('toZipcode', formatted)

    if (isValidZipcode(zipcode)) {
      const addressData = await fetchAddressByZipcode(zipcode)
      if (addressData) {
        updateField('toPrefecture', formatFullAddress(addressData))
      }
    }
  }

  // 住所検索ボタンの処理
  const handleAddressSearch = async (type: 'from' | 'to') => {
    const zipcode = type === 'from' ? formData.fromZipcode : formData.toZipcode
    if (isValidZipcode(zipcode)) {
      const addressData = await fetchAddressByZipcode(zipcode)
      if (addressData) {
        const field = type === 'from' ? 'fromPrefecture' : 'toPrefecture'
        updateField(field, formatFullAddress(addressData))
      }
    }
  }

  // フォーム送信の処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // バリデーション
    if (!validateForm()) {
      return
    }

    // バリデーション通過後、確認画面に遷移
    navigateToConfirmation()
  }

  // 初期化中はローディング表示
  if (!isInitialized) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003672] mx-auto mb-4"></div>
          <p className="text-[#5c6f8b]">データを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <form className="bg-white rounded-lg shadow-lg p-8" onSubmit={handleSubmit}>
        {/* 基本情報セクション */}
        <FormSection title={FORM_SECTIONS.BASIC_INFO.title} description={FORM_SECTIONS.BASIC_INFO.description}>
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              label="お名前"
              placeholder="山田 太郎"
              required
              value={formData.name}
              onChange={(value) => updateField('name', value)}
              error={errors.name}
              name="name"
            />
            <FormField
              label="フリガナ"
              placeholder="ヤマダ タロウ"
              required
              value={formData.nameFurigana}
              onChange={(value) => updateField('nameFurigana', value)}
              error={errors.nameFurigana}
              name="nameFurigana"
            />
            <FormField
              label="電話番号"
              type="tel"
              placeholder="090-1234-5678"
              required
              value={formData.phone}
              onChange={(value) => updateField('phone', value)}
              error={errors.phone}
              name="phone"
            />
            <FormField
              label="メールアドレス"
              type="email"
              placeholder="example@email.com"
              required
              value={formData.email}
              onChange={(value) => updateField('email', value)}
              error={errors.email}
              name="email"
            />
          </div>
        </FormSection>

        {/* 引越し元住所セクション */}
        <FormSection title={FORM_SECTIONS.FROM_ADDRESS.title}>
          <div className="space-y-6">
            <ZipcodeInput
              label="引越し元の情報"
              zipcodeValue={formData.fromZipcode}
              prefectureValue={formData.fromPrefecture}
              streetAddressValue={formData.fromStreetAddress}
              buildingDetailsValue={formData.fromBuildingDetails}
              onZipcodeChange={handleFromZipcodeChange}
              onPrefectureChange={(value) => updateField('fromPrefecture', value)}
              onStreetAddressChange={(value) => updateField('fromStreetAddress', value)}
              onBuildingDetailsChange={(value) => updateField('fromBuildingDetails', value)}
              onAddressSearch={() => handleAddressSearch('from')}
              required
              error={errors.fromZipcode || errors.fromPrefecture || errors.fromStreetAddress}
              name="fromZipcode"
            />
            <BuildingInfo
              buildingType={formData.fromBuildingType}
              roomLayout={formData.fromRoomLayout}
              floor={formData.fromFloor}
              elevator={formData.fromElevator}
              onBuildingTypeChange={(value) => updateField('fromBuildingType', value)}
              onRoomLayoutChange={(value) => updateField('fromRoomLayout', value)}
              onFloorChange={(value) => updateField('fromFloor', value)}
              onElevatorChange={(value) => updateField('fromElevator', value)}
              errors={{
                buildingType: errors.fromBuildingType,
                roomLayout: errors.fromRoomLayout,
                floor: errors.fromFloor,
                elevator: errors.fromElevator,
              }}
            />
          </div>
        </FormSection>

        {/* 引越し先住所セクション */}
        <FormSection title={FORM_SECTIONS.TO_ADDRESS.title}>
          <div className="space-y-6">
            <ZipcodeInput
              label="引越し先の情報"
              zipcodeValue={formData.toZipcode}
              prefectureValue={formData.toPrefecture}
              streetAddressValue={formData.toStreetAddress}
              buildingDetailsValue={formData.toBuildingDetails}
              onZipcodeChange={handleToZipcodeChange}
              onPrefectureChange={(value) => updateField('toPrefecture', value)}
              onStreetAddressChange={(value) => updateField('toStreetAddress', value)}
              onBuildingDetailsChange={(value) => updateField('toBuildingDetails', value)}
              onAddressSearch={() => handleAddressSearch('to')}
              required
              error={errors.toZipcode || errors.toPrefecture || errors.toStreetAddress}
              name="toZipcode"
            />
            <BuildingInfo
              buildingType={formData.toBuildingType}
              roomLayout={formData.toRoomLayout}
              floor={formData.toFloor}
              elevator={formData.toElevator}
              onBuildingTypeChange={(value) => updateField('toBuildingType', value)}
              onRoomLayoutChange={(value) => updateField('toRoomLayout', value)}
              onFloorChange={(value) => updateField('toFloor', value)}
              onElevatorChange={(value) => updateField('toElevator', value)}
              errors={{
                buildingType: errors.toBuildingType,
                roomLayout: errors.toRoomLayout,
                floor: errors.toFloor,
                elevator: errors.toElevator,
              }}
            />
          </div>
        </FormSection>

        {/* 人数・日程・時間セクション */}
        <FormSection title={FORM_SECTIONS.PEOPLE_SCHEDULE_TIME.title}>
          <PeopleScheduleTime
            peopleCount={formData.peopleCount}
            movingDateType={formData.movingDateType}
            movingYearMonth={formData.movingYearMonth}
            movingPeriod={formData.movingPeriod}
            movingSpecificDate={formData.movingSpecificDate}
            workStartTimeType={formData.workStartTimeType}
            workStartTime={formData.workStartTime}
            onPeopleCountChange={(value) => updateField('peopleCount', value)}
            onMovingDateTypeChange={(value) => updateField('movingDateType', value)}
            onMovingYearMonthChange={(value) => updateField('movingYearMonth', value)}
            onMovingPeriodChange={(value) => updateField('movingPeriod', value)}
            onMovingSpecificDateChange={(value) => updateField('movingSpecificDate', value)}
            onWorkStartTimeTypeChange={(value) => updateField('workStartTimeType', value)}
            onWorkStartTimeChange={(value) => updateField('workStartTime', value)}
            errors={{
              peopleCount: errors.peopleCount,
              movingDateType: errors.movingDateType,
              movingYearMonth: errors.movingYearMonth,
              movingPeriod: errors.movingPeriod,
              movingSpecificDate: errors.movingSpecificDate,
              workStartTimeType: errors.workStartTimeType,
              workStartTime: errors.workStartTime,
            }}
          />
        </FormSection>

        {/* お荷物量セクション */}
        <FormSection title={FORM_SECTIONS.LUGGAGE_INFO.title}>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">お持ちの荷物の種類と数量を選択してください</p>
            <LuggageSelector selectedItems={formData.luggageItems} onQuantityChange={updateLuggageQuantity} />

            {/* 上記以外の家財 */}
            <div className="mt-6">
              <FormField
                label="上記以外の家財"
                type="textarea"
                placeholder="選択肢にない家財がある場合は、こちらにご記入ください（例：大型の観葉植物、アンティーク家具、楽器など）"
                value={formData.otherLuggage}
                onChange={(value) => updateField('otherLuggage', value)}
                error={errors.otherLuggage}
                name="otherLuggage"
                rows={8}
                className="mt-2"
              />
            </div>
          </div>
        </FormSection>

        {/* 送信ボタン */}
        <div className="text-center">
          {/* 開発環境用のテストデータボタン */}
          {isDevelopment && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 mb-3">開発環境モード</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <button
                  type="button"
                  onClick={() => loadTestData()}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-md transition-colors"
                >
                  テストデータを読み込み
                </button>
                <button
                  type="button"
                  onClick={loadInvalidData}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md transition-colors"
                >
                  バリデーションエラー用データ
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-md transition-colors"
                >
                  フォームをクリア
                </button>
              </div>
              <p className="text-xs text-yellow-700 mt-2 text-center">
                バリデーションエラー用データボタンで、必須項目やフォーマットエラーをテストできます
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full md:w-auto text-white font-bold py-4 px-12 rounded-lg transition-all duration-150 text-lg shadow-lg ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed shadow-lg translate-y-0'
                : 'bg-[#003672] hover:bg-[#5c6f8b] hover:shadow-md hover:translate-y-0.5'
            }`}
          >
            {isSubmitting ? '確認中...' : '内容を確認する'}
          </button>
          <p className="text-sm text-[#5c6f8b] mt-4">確認画面で最終確認後、見積もり依頼を送信します</p>
        </div>

        {/* 自動復元確認モーダル */}
        <AutoRestoreModal
          isOpen={showAutoRestoreModal}
          onAccept={handleAutoRestoreAccept}
          onDecline={handleAutoRestoreDecline}
        />
      </form>

      {/* ローディングオーバーレイ */}
      {isSubmitting && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-lg">
          <div className="bg-white rounded-lg p-8 shadow-xl">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003672]"></div>
              <p className="text-[#003672] font-medium">確認中...</p>
              <p className="text-sm text-gray-600">しばらくお待ちください</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EstimateForm
