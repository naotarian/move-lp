'use client'

import React, { useState, useCallback } from 'react'
import { EstimateFormData, LuggageItem } from '@/types/estimate'
import { getLuggageData } from '@/lib/luggage-data'

export interface FormErrors {
  [key: string]: string | undefined
}

export interface UseEstimateFormReturn {
  formData: EstimateFormData
  errors: FormErrors
  isSubmitting: boolean
  updateField: (field: keyof EstimateFormData, value: string | Date | string[] | readonly string[] | undefined) => void
  updateLuggageQuantity: (item: LuggageItem, quantity: number) => void
  validateField: (field: keyof EstimateFormData) => boolean
  validateForm: () => boolean
  clearErrors: () => void
  resetForm: () => void
  setIsSubmitting: (submitting: boolean) => void
  loadTestData: () => Promise<void>
  loadInvalidData: () => void
  navigateToConfirmation: () => void
  // 自動復元関連
  showAutoRestoreModal: boolean
  handleAutoRestoreAccept: () => void
  handleAutoRestoreDecline: () => void
}

const initialFormData: EstimateFormData = {
  name: '',
  nameFurigana: '',
  phone: '',
  email: '',
  peopleCount: '',
  movingDateType: '',
  movingYearMonth: '',
  movingPeriod: '',
  movingSpecificDate: '',
  workStartTimeType: '',
  workStartTime: '',
  fromZipcode: '',
  fromPrefecture: '',
  fromStreetAddress: '',
  fromBuildingDetails: '',
  fromBuildingType: '',
  fromRoomLayout: '',
  fromFloor: '',
  fromElevator: '',
  toZipcode: '',
  toPrefecture: '',
  toStreetAddress: '',
  toBuildingDetails: '',
  toBuildingType: '',
  toRoomLayout: '',
  toFloor: '',
  toElevator: '',

  // お荷物量
  luggageItems: [],
  otherLuggage: '',
}

// テスト用の荷物データを取得
const getTestLuggageItems = async (): Promise<LuggageItem[]> => {
  try {
    const luggageData = await getLuggageData()
    const testItems: LuggageItem[] = []

    // 各カテゴリーから特定のアイテムを選択してテストデータを作成
    luggageData.forEach((category) => {
      category.items.forEach((item, index) => {
        // 最初の数個のアイテムに数量を設定
        if (index < 3) {
          testItems.push({
            ...item,
            quantity: index + 1,
            category: category.code,
          })
        }
      })
    })

    return testItems
  } catch (error) {
    console.error('Failed to load test luggage data:', error)
    return []
  }
}

// 開発環境用のテストデータ
const getTestData = async (): Promise<EstimateFormData> => {
  return {
    name: '田中 太郎',
    nameFurigana: 'タナカ タロウ',
    phone: '090-1234-5678',
    email: 'test@example.com',
    fromZipcode: '150-0002',
    fromPrefecture: '東京都渋谷区渋谷',
    fromStreetAddress: '1-2-3',
    fromBuildingDetails: '渋谷ビル 101号室',
    fromBuildingType: 'mansion',
    fromRoomLayout: '2LDK',
    fromFloor: '5',
    fromElevator: 'yes',
    toZipcode: '220-0011',
    toPrefecture: '神奈川県横浜市西区みなとみらい',
    toStreetAddress: '2-2-1',
    toBuildingDetails: 'ランドマークプラザ 205号室',
    toBuildingType: 'mansion',
    toRoomLayout: '3LDK',
    toFloor: '8',
    toElevator: 'yes',
    peopleCount: '3',
    movingDateType: 'decided',
    movingYearMonth: '',
    movingPeriod: '',
    movingSpecificDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    workStartTimeType: 'specific',
    workStartTime: 'morning',
    luggageItems: await getTestLuggageItems(),
    otherLuggage: '大型の観葉植物、アンティーク家具、楽器（ギター・ドラムセット）',
  }
}

// バリデーションエラー用のテストデータ
const getInvalidTestData = (): EstimateFormData => {
  return {
    name: '', // 空（必須エラー）
    nameFurigana: '', // 空（必須エラー）
    phone: 'invalid-phone', // 無効な電話番号
    email: 'test@test.com', // 無効なメールアドレス
    fromZipcode: '123', // 不完全な郵便番号
    fromPrefecture: '', // 空（必須エラー）
    fromStreetAddress: '', // 空（必須エラー）
    fromBuildingDetails: '',
    fromBuildingType: '',
    fromRoomLayout: '',
    fromFloor: '',
    fromElevator: '',
    toZipcode: '', // 空（必須エラー）
    toPrefecture: '', // 空（必須エラー）
    toStreetAddress: '', // 空（必須エラー）
    toBuildingDetails: '',
    toBuildingType: '',
    toRoomLayout: '',
    toFloor: '',
    toElevator: '',
    peopleCount: '', // 空（必須エラー）
    movingDateType: '', // 空（必須エラー）
    movingYearMonth: '',
    movingPeriod: '',
    movingSpecificDate: '',
    workStartTimeType: '', // 空（必須エラー）
    workStartTime: '',
    luggageItems: [],
    otherLuggage: '',
  }
}

export const useEstimateForm = (useTestData: boolean = false): UseEstimateFormReturn => {
  const [formData, setFormData] = useState<EstimateFormData>(initialFormData)
  const [isInitialized, setIsInitialized] = useState(false)

  // データ初期化処理
  React.useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      const savedData = sessionStorage.getItem('estimateFormData')

      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)

          // クエリパラメータをチェック
          const urlParams = new URLSearchParams(window.location.search)
          const fromConfirmation = urlParams.get('from') === 'confirmation'

          if (fromConfirmation) {
            // データの型を確実に復元
            const restoredData: EstimateFormData = {
              ...initialFormData,
              ...parsedData,
              movingDate: parsedData.movingDate ? parsedData.movingDate : '',
              luggageItems: Array.isArray(parsedData.luggageItems) ? parsedData.luggageItems : [],
            }

            setFormData(restoredData)

            // クエリパラメータをクリア（ブラウザ履歴を汚さないため）
            const newUrl = new URL(window.location.href)
            newUrl.searchParams.delete('from')
            window.history.replaceState({}, '', newUrl.toString())

            setIsInitialized(true)
            return
          }

          // データに有効な値があるかチェック
          const hasValidData = Object.values(parsedData).some((value) => {
            if (typeof value === 'string') return value.trim() !== ''
            if (Array.isArray(value)) return value.length > 0
            return value !== null && value !== undefined
          })

          if (hasValidData) {
            // 有効なデータがある場合は自動復元の確認を表示
            setShowAutoRestoreModal(true)

            // データの型を確実に復元
            const restoredData: EstimateFormData = {
              ...initialFormData,
              ...parsedData,
              movingDate: parsedData.movingDate ? parsedData.movingDate : '',
              luggageItems: Array.isArray(parsedData.luggageItems) ? parsedData.luggageItems : [],
            }

            // 一時的にデータを保存（ユーザーの選択を待つ）
            setFormData(restoredData)
          } else {
            // 有効なデータがない場合は初期データを使用
            setFormData(initialFormData)
          }
        } catch (error) {
          console.error('セッションストレージからのデータ復元エラー:', error)
          setFormData(initialFormData)
        }
      } else if (useTestData) {
        // テストデータが有効な場合はテストデータを使用
        setFormData(getTestData())
      } else {
        // どちらもない場合は初期データを使用
        setFormData(initialFormData)
      }

      setIsInitialized(true)
    }
  }, [useTestData, isInitialized])

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAutoRestoreModal, setShowAutoRestoreModal] = useState(false)

  // エラーフィールドまでスクロールする関数
  const scrollToFirstError = useCallback((fieldName: string) => {
    // フォーム内の要素を検索（複数のパターンを試す）
    let fieldElement = null

    // 1. name属性で検索
    fieldElement = document.querySelector(`[name="${fieldName}"]`)

    // 2. id属性で検索
    if (!fieldElement) {
      fieldElement = document.querySelector(`#${fieldName}`)
    }

    // 3. data-field属性で検索
    if (!fieldElement) {
      fieldElement = document.querySelector(`[data-field="${fieldName}"]`)
    }

    // 4. フォーム要素の親要素を検索（ZipcodeInputなどの場合）
    if (!fieldElement) {
      fieldElement = document.querySelector(`[data-field*="${fieldName}"]`)
    }

    if (fieldElement) {
      // スムーズスクロールでエラーフィールドまで移動
      fieldElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      })

      // フォーカスを当てる（可能な場合）
      if (fieldElement instanceof HTMLElement && 'focus' in fieldElement) {
        setTimeout(() => {
          fieldElement.focus()
        }, 300) // スクロール完了後にフォーカス
      }
    }
  }, [])

  // フォームデータをセッションストレージに保存
  const saveFormData = useCallback((data: EstimateFormData) => {
    if (typeof window !== 'undefined') {
      try {
        // データを確実にシリアライズできるように型変換
        const serializableData = {
          ...data,
        }
        sessionStorage.setItem('estimateFormData', JSON.stringify(serializableData))
      } catch (error) {
        console.error('セッションストレージへの保存エラー:', error)
      }
    }
  }, [])

  // フィールドの更新
  const updateField = useCallback(
    (field: keyof EstimateFormData, value: string | Date | string[] | readonly string[] | undefined) => {
      setFormData((prev) => {
        const newData = {
          ...prev,
          [field]: value,
        }
        // データをセッションストレージに保存
        saveFormData(newData)
        return newData
      })

      // エラーをクリア
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }))
      }
    },
    [errors, saveFormData],
  )

  // 個別フィールドのバリデーション
  const validateField = useCallback(
    (field: keyof EstimateFormData): boolean => {
      const value = formData[field]
      let error: string | undefined

      switch (field) {
        case 'name':
          if (!value || typeof value !== 'string' || !value.trim()) {
            error = 'お名前を入力してください'
          }
          break

        case 'nameFurigana':
          if (!value || typeof value !== 'string' || !value.trim()) {
            error = 'フリガナを入力してください'
          } else if (!/^[ァ-ヶー\s]+$/.test(value)) {
            error = 'フリガナはカタカナで入力してください'
          }
          break

        case 'phone':
          if (!value || typeof value !== 'string' || !value.trim()) {
            error = '電話番号を入力してください'
          } else if (!/^[\d-+()]+$/.test(value)) {
            error = '正しい電話番号を入力してください'
          }
          break

        case 'email':
          if (!value || typeof value !== 'string' || !value.trim()) {
            error = 'メールアドレスを入力してください'
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = '正しいメールアドレスを入力してください'
          }
          break

        case 'fromZipcode':
        case 'fromPrefecture':
          if (field === 'fromZipcode' && (!value || typeof value !== 'string' || !value.trim())) {
            error = '引越し元の郵便番号を入力してください'
          } else if (field === 'fromPrefecture' && (!value || typeof value !== 'string' || !value.trim())) {
            error = '引越し元の住所を入力してください'
          }
          break

        case 'toZipcode':
        case 'toPrefecture':
          if (field === 'toZipcode' && (!value || typeof value !== 'string' || !value.trim())) {
            error = '引越し先の郵便番号を入力してください'
          } else if (field === 'toPrefecture' && (!value || typeof value !== 'string' || !value.trim())) {
            error = '引越し先の住所を入力してください'
          }
          break

        case 'peopleCount':
          if (!value || typeof value !== 'string' || !value.trim()) {
            error = '引越し人数を選択してください'
          }
          break

        case 'movingDateType':
          if (!value || typeof value !== 'string' || !value.trim()) {
            error = '引越し日の設定を選択してください'
          }
          break

        case 'movingSpecificDate':
          // 引越し日が「決まっている」場合のみ必須
          if (formData.movingDateType === 'decided') {
            if (!value || typeof value !== 'string' || !value.trim()) {
              error = '引越し日を選択してください'
            } else {
              const selectedDate = new Date(value)
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              if (selectedDate < today) {
                error = '過去の日付は選択できません'
              }
            }
          }
          break

        case 'movingYearMonth':
          // 引越し日が「決まっていない」場合のみ必須
          if (formData.movingDateType === 'undecided') {
            if (!value || typeof value !== 'string' || !value.trim()) {
              error = '引越しの年月を選択してください'
            }
          }
          break

        case 'movingPeriod':
          // 引越し日が「決まっていない」場合のみ必須
          if (formData.movingDateType === 'undecided') {
            if (!value || typeof value !== 'string' || !value.trim()) {
              error = '引越しの期間を選択してください'
            }
          }
          break

        case 'workStartTimeType':
          if (!value || typeof value !== 'string' || !value.trim()) {
            error = '作業開始時間の設定を選択してください'
          }
          break

        case 'workStartTime':
          // 作業開始時間が「指定する」場合のみ必須
          if (formData.workStartTimeType === 'specific') {
            if (!value || typeof value !== 'string' || !value.trim()) {
              error = '作業開始時間を選択してください'
            }
          }
          break

        // 建物情報のバリデーション
        case 'fromBuildingType':
        case 'fromRoomLayout':
        case 'fromFloor':
        case 'fromElevator':
          if (!value || typeof value !== 'string' || !value.trim()) {
            const fieldNames = {
              fromBuildingType: '建物のタイプ',
              fromRoomLayout: '間取り',
              fromFloor: 'お住まいの階数',
              fromElevator: 'エレベーター',
            }
            error = `引越し元の${fieldNames[field as keyof typeof fieldNames]}を選択してください`
          }
          break

        case 'toBuildingType':
        case 'toRoomLayout':
        case 'toFloor':
        case 'toElevator':
          if (!value || typeof value !== 'string' || !value.trim()) {
            const fieldNames = {
              toBuildingType: '建物のタイプ',
              toRoomLayout: '間取り',
              toFloor: 'お住まいの階数',
              toElevator: 'エレベーター',
            }
            error = `引越し先の${fieldNames[field as keyof typeof fieldNames]}を選択してください`
          }
          break
      }

      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }))

      return !error
    },
    [formData],
  )

  // フォーム全体のバリデーション
  const validateForm = useCallback((): boolean => {
    const fieldsToValidate: (keyof EstimateFormData)[] = [
      'name',
      'nameFurigana',
      'phone',
      'email',
      'fromZipcode',
      'fromPrefecture',
      'fromStreetAddress',
      'fromBuildingType',
      'fromRoomLayout',
      'fromFloor',
      'fromElevator',
      'toZipcode',
      'toPrefecture',
      'toStreetAddress',
      'toBuildingType',
      'toRoomLayout',
      'toFloor',
      'toElevator',
      'peopleCount',
      'movingDateType',
      'workStartTimeType',
    ]

    // 条件に応じて追加のフィールドをバリデーション
    if (formData.movingDateType === 'decided') {
      fieldsToValidate.push('movingSpecificDate')
    } else if (formData.movingDateType === 'undecided') {
      fieldsToValidate.push('movingYearMonth', 'movingPeriod')
    }

    if (formData.workStartTimeType === 'specific') {
      fieldsToValidate.push('workStartTime')
    }

    let isValid = true
    const newErrors: FormErrors = {}
    const errorFields: string[] = []

    fieldsToValidate.forEach((field) => {
      const fieldValid = validateField(field)
      if (!fieldValid) {
        isValid = false
        // 重複を避けるため、既に配列にない場合のみ追加
        if (!errorFields.includes(field)) {
          errorFields.push(field)
        }
      }
    })

    // 住所の組み合わせチェック
    if (!formData.fromZipcode.trim() || !formData.fromPrefecture.trim() || !formData.fromStreetAddress.trim()) {
      newErrors.fromZipcode = '引越し元住所を入力してください'
      isValid = false
      if (!errorFields.includes('fromZipcode')) {
        errorFields.push('fromZipcode')
      }
    }

    if (!formData.toZipcode.trim() || !formData.toPrefecture.trim() || !formData.toStreetAddress.trim()) {
      newErrors.toZipcode = '引越し先住所を入力してください'
      isValid = false
      if (!errorFields.includes('toZipcode')) {
        errorFields.push('toZipcode')
      }
    }

    // 引越し日の詳細チェック
    if (formData.movingDateType === 'decided') {
      if (!formData.movingSpecificDate.trim()) {
        newErrors.movingSpecificDate = '引越し日を選択してください'
        isValid = false
        if (!errorFields.includes('movingSpecificDate')) {
          errorFields.push('movingSpecificDate')
        }
      } else {
        // 過去の日付チェック
        const selectedDate = new Date(formData.movingSpecificDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0) // 今日の0時0分に設定

        if (selectedDate < today) {
          newErrors.movingSpecificDate = '過去の日付は選択できません'
          isValid = false
          if (!errorFields.includes('movingSpecificDate')) {
            errorFields.push('movingSpecificDate')
          }
        }
      }
    }

    // 既存のエラーと新しいエラーをマージ
    setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }))

    // エラーがある場合、最初のエラーフィールドまでスクロール
    if (!isValid && errorFields.length > 0) {
      scrollToFirstError(errorFields[0])
    }

    return isValid
  }, [formData, validateField, scrollToFirstError])

  // エラーのクリア
  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  // 確認画面に遷移
  const navigateToConfirmation = useCallback(() => {
    // フォームデータをセッションストレージに保存
    saveFormData(formData)
    // 確認画面に遷移
    if (typeof window !== 'undefined') {
      window.location.href = '/estimate/confirmation'
    }
  }, [formData, saveFormData])

  // 荷物数量の更新
  const updateLuggageQuantity = useCallback(
    (item: LuggageItem, quantity: number) => {
      setFormData((prev) => {
        // 既存のアイテムを探す
        const existingItem = prev.luggageItems.find((existingItem) => existingItem.id === item.id)

        let newLuggageItems: LuggageItem[]
        if (existingItem) {
          // 既存のアイテムの数量を更新
          newLuggageItems = prev.luggageItems.map((existingItem) =>
            existingItem.id === item.id ? { ...existingItem, quantity } : existingItem,
          )
        } else {
          // 新しいアイテムを追加
          const newItem: LuggageItem = {
            ...item,
            quantity,
          }
          newLuggageItems = [...prev.luggageItems, newItem]
        }

        const newData = { ...prev, luggageItems: newLuggageItems }
        saveFormData(newData)
        return newData
      })
    },
    [saveFormData],
  )

  // フォームのリセット
  const resetForm = useCallback(() => {
    setFormData(initialFormData)
    setErrors({})
    setIsSubmitting(false)
    // セッションストレージもクリア
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('estimateFormData')
    }
  }, [])

  // テストデータの読み込み（開発環境用）
  const loadTestData = useCallback(async () => {
    const testData = await getTestData()
    setFormData(testData)
    setErrors({})
  }, [])

  // 無効なテストデータの読み込み（バリデーションエラー用）
  const loadInvalidData = useCallback(() => {
    setFormData(getInvalidTestData())
    setErrors({})
  }, [])

  // 自動復元の受け入れ
  const handleAutoRestoreAccept = useCallback(() => {
    setShowAutoRestoreModal(false)
    // データは既に復元されているので、そのまま使用
  }, [])

  // 自動復元の拒否
  const handleAutoRestoreDecline = useCallback(() => {
    setShowAutoRestoreModal(false)
    setFormData(initialFormData)

    // セッションストレージからデータを削除
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('estimateFormData')
    }
  }, [])

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    updateLuggageQuantity,
    validateField,
    validateForm,
    clearErrors,
    resetForm,
    setIsSubmitting,
    loadTestData,
    loadInvalidData,
    navigateToConfirmation,
    // 自動復元関連
    showAutoRestoreModal,
    handleAutoRestoreAccept,
    handleAutoRestoreDecline,
  }
}
