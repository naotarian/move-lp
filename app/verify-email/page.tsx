'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, AlertCircle, Loader2, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | 'invalid'>('loading')
  const [message, setMessage] = useState('')
  const [estimateId, setEstimateId] = useState<string | null>(null)
  const [alreadyVerified, setAlreadyVerified] = useState(false)

  useEffect(() => {
    if (!token) {
      setVerificationStatus('invalid')
      setMessage('認証トークンが見つかりません')
      return
    }

    verifyEmail(token)
  }, [token])

  const verifyEmail = async (token: string) => {
    try {
      setVerificationStatus('loading')

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
        }/api/verification/verify-email?token=${token}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      const result = await response.json()

      if (result.success) {
        setVerificationStatus('success')
        setMessage(result.message)
        setEstimateId(result.estimate_id)
        setAlreadyVerified(result.already_verified || false)
      } else {
        setVerificationStatus('error')
        setMessage(result.message || '認証に失敗しました')
      }
    } catch (error) {
      console.error('Email verification error:', error)
      setVerificationStatus('error')
      setMessage('認証中にエラーが発生しました。しばらく時間をおいて再度お試しください。')
    }
  }

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'loading':
        return <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-600" />
      case 'error':
      case 'invalid':
        return <XCircle className="h-16 w-16 text-red-600" />
      default:
        return <AlertCircle className="h-16 w-16 text-yellow-600" />
    }
  }

  const getStatusTitle = () => {
    switch (verificationStatus) {
      case 'loading':
        return 'メールアドレスを認証中...'
      case 'success':
        return alreadyVerified ? 'メールアドレスは認証済みです' : 'メールアドレスの認証が完了しました'
      case 'error':
        return '認証に失敗しました'
      case 'invalid':
        return '無効なリンクです'
      default:
        return '認証処理中'
    }
  }

  const getStatusDescription = () => {
    switch (verificationStatus) {
      case 'loading':
        return 'しばらくお待ちください...'
      case 'success':
        return alreadyVerified
          ? 'このメールアドレスは既に認証されています。引き続きサービスをご利用いただけます。'
          : 'ありがとうございます！メールアドレスの認証が正常に完了しました。これで複数の業者から見積もりを受け取ることができます。'
      case 'error':
      case 'invalid':
        return message
      default:
        return ''
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">{getStatusIcon()}</div>
            <CardTitle className="text-2xl font-bold text-gray-900">{getStatusTitle()}</CardTitle>
            <CardDescription className="text-base text-gray-600">{getStatusDescription()}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 見積もりID表示 */}
            {estimateId && (
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <span className="font-medium">見積もりID:</span> {estimateId}
                </AlertDescription>
              </Alert>
            )}

            {/* 成功時の次のステップ */}
            {verificationStatus === 'success' && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-2">今後の流れ</h3>
                <ol className="text-sm text-green-800 space-y-2">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                      1
                    </span>
                    複数の業者から見積もりが届きます（通常1-3営業日）
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                      2
                    </span>
                    見積もり内容を比較して、お気に入りの業者を選択
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                      3
                    </span>
                    選んだ業者と直接やり取りして、引越しの詳細を決定
                  </li>
                </ol>
              </div>
            )}

            {/* エラー時のアクション */}
            {verificationStatus === 'error' && (
              <Alert className="bg-red-50 border-red-200">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  認証リンクが期限切れの場合は、見積もり完了ページから再送信をお試しください。
                </AlertDescription>
              </Alert>
            )}

            {/* アクションボタン */}
            <div className="space-y-3">
              {verificationStatus === 'success' || verificationStatus === 'error' ? (
                <Button asChild className="w-full">
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    トップページに戻る
                  </Link>
                </Button>
              ) : verificationStatus === 'invalid' ? (
                <Button asChild variant="outline" className="w-full">
                  <Link href="/estimate">新しく見積もりを依頼する</Link>
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>

        {/* フッター情報 */}
        <div className="text-center text-sm text-gray-500">
          <p>お困りの場合は、お気軽にお問い合わせください。</p>
          <Link href="/contact" className="text-blue-600 hover:text-blue-800 underline">
            お問い合わせはこちら
          </Link>
        </div>
      </div>
    </div>
  )
}
