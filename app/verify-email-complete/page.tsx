import React from 'react'
import Link from 'next/link'
import { CheckCircle, XCircle, AlertCircle, Smartphone, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SmsVerificationForm } from '@/components/verification/SmsVerificationForm'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function VerifyEmailCompletePage({ searchParams }: PageProps) {
  const params = await searchParams

  // URL パラメータから状態を取得
  const error = params.error as string | undefined
  const estimateId = params.estimate_id as string | undefined
  const status = params.status as string | undefined
  const alreadyVerified = params.already_verified === 'true'

  // 成功時の判定
  const isSuccess = status === 'success' && !error

  // エラー時の表示
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <XCircle className="h-16 w-16 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">認証エラー</CardTitle>
              <CardDescription className="text-base text-gray-600">{getErrorMessage(error)}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  トップページに戻る
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // 成功時のみ表示
  if (!isSuccess) {
    return null // エラーの場合は上で処理済み
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {alreadyVerified ? 'メールアドレスは認証済みです' : 'メールアドレスの認証が完了しました'}
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              {alreadyVerified
                ? 'このメールアドレスは既に認証されています。'
                : 'ありがとうございます！メールアドレスの認証が正常に完了しました。'}
            </CardDescription>
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

            <Separator />

            {/* SMS認証セクション */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">電話番号認証</h3>
                  <p className="text-sm text-gray-600">SMS認証コードで電話番号の認証を完了してください。</p>
                </div>
              </div>

              {/* SMS認証フォーム（Client Component） */}
              <SmsVerificationForm estimateId={estimateId} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// エラーメッセージを取得する関数
function getErrorMessage(error: string): string {
  switch (error) {
    case 'no_token':
      return '認証トークンが見つかりません。メール内のリンクを正しくクリックしてください。'
    case 'invalid_token':
      return '認証トークンが無効または期限切れです。新しい認証メールをリクエストしてください。'
    case 'estimate_not_found':
      return '見積もり情報が見つかりません。サポートにお問い合わせください。'
    case 'verification_failed':
      return 'メール認証に失敗しました。しばらく時間をおいて再度お試しください。'
    case 'server_error':
      return 'サーバーエラーが発生しました。しばらく時間をおいて再度お試しください。'
    default:
      return '認証中にエラーが発生しました。'
  }
}
