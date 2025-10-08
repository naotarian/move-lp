'use client'

import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Home, Mail, RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function ThanksPage() {
  const searchParams = useSearchParams()
  const estimateId = searchParams.get('id')
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')
  const [resendError, setResendError] = useState('')

  // メール再送処理
  const handleResendEmail = async () => {
    if (!estimateId) {
      setResendError('見積もりIDが見つかりません')
      return
    }

    setIsResending(true)
    setResendMessage('')
    setResendError('')

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/verification/resend-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            estimate_id: estimateId,
          }),
        },
      )

      if (!response.ok) {
        throw new Error('メールの再送に失敗しました')
      }

      const result = await response.json()

      if (result.success) {
        setResendMessage('認証メールを再送しました。メールボックスをご確認ください。')
      } else {
        setResendError(result.message || 'メールの再送に失敗しました')
      }
    } catch (error) {
      console.error('メール再送エラー:', error)
      setResendError('メールの再送中にエラーが発生しました。しばらく時間をおいて再度お試しください。')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* 成功アイコン */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          {/* タイトル */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">見積もり依頼を受け付けました</h1>

          {/* メール認証案内 */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <Mail className="h-6 w-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">メール認証が必要です</h3>
                <div className="text-sm text-blue-800 space-y-2">
                  <p>ご登録いただいたメールアドレスに認証メールをお送りしました。</p>
                  <p>メール内の認証リンクをクリックして、認証を完了してください。</p>
                  <p className="font-medium">認証完了後、複数の業者から見積もりが届きます。</p>
                </div>

                {/* 再送ボタンとメッセージ */}
                <div className="mt-4">
                  <Button
                    onClick={handleResendEmail}
                    disabled={isResending}
                    variant="outline"
                    size="sm"
                    className="text-blue-700 border-blue-300 hover:bg-blue-100"
                  >
                    {isResending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        再送中...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        認証メールを再送
                      </>
                    )}
                  </Button>
                </div>

                {/* 再送成功メッセージ */}
                {resendMessage && (
                  <Alert className="mt-3 bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{resendMessage}</AlertDescription>
                  </Alert>
                )}

                {/* 再送エラーメッセージ */}
                {resendError && (
                  <Alert className="mt-3 bg-red-50 border-red-200">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">{resendError}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </div>

          {/* 次のステップ */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">今後の流れ</h3>
            <ol className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  1
                </span>
                メール認証を完了してください
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  2
                </span>
                複数の業者から見積もりが届きます（通常1-3営業日）
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  3
                </span>
                見積もり内容を比較して、お気に入りの業者を選択
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  4
                </span>
                選んだ業者と直接やり取りして、引越しの詳細を決定
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
