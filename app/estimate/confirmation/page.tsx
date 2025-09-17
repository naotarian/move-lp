'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import ConfirmationForm from '@/components/estimate/ConfirmationForm'
import { trackPageVisit } from '@/utils/pageTracking'

const ConfirmationPage: React.FC = () => {
  const router = useRouter()

  // セッションストレージからデータを取得
  const [formData, setFormData] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  // ページ訪問を追跡
  React.useEffect(() => {
    trackPageVisit('/estimate/confirmation')
  }, [])

  React.useEffect(() => {
    // セッションストレージからフォームデータを取得
    const savedData = sessionStorage.getItem('estimateFormData')

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setFormData(parsedData)
      } catch (error) {
        console.error('フォームデータの解析エラー:', error)
        // データが不正な場合は入力画面に戻る
        router.push('/estimate')
      }
    } else {
      // データがない場合は入力画面に戻る
      router.push('/estimate')
    }

    setIsLoading(false)
  }, [router])

  // 入力画面に戻る処理
  const handleBackToForm = () => {
    router.push('/estimate')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003672] mx-auto mb-4"></div>
          <p className="text-[#5c6f8b]">データを読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">データが見つかりません</p>
          <button
            onClick={handleBackToForm}
            className="bg-[#003672] hover:bg-[#5c6f8b] text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            入力画面に戻る
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#003672] mb-4">見積もり内容の確認</h1>
            <p className="text-[#5c6f8b]">
              入力内容をご確認ください。問題がなければ「見積もりを依頼」ボタンをクリックしてください。
            </p>
          </div>

          <ConfirmationForm formData={formData} onBackToForm={handleBackToForm} />
        </div>
      </div>
    </div>
  )
}

export default ConfirmationPage
