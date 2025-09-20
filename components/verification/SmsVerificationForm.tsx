'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, RefreshCw, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface SmsVerificationFormProps {
  estimateId?: string
}

export function SmsVerificationForm({ estimateId }: SmsVerificationFormProps) {
  // SMS認証フォームの状態
  const [smsCode, setSmsCode] = useState('')
  const [isVerifyingSms, setIsVerifyingSms] = useState(false)
  const [isResendingSms, setIsResendingSms] = useState(false)
  const [isLoadingSmsStatus, setIsLoadingSmsStatus] = useState(true)
  const [smsVerificationStatus, setSmsVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [smsVerificationMessage, setSmsVerificationMessage] = useState('')
  const [resendMessage, setResendMessage] = useState('')
  const [resendError, setResendError] = useState('')

  // SMS送信状況
  const [smsStatus, setSmsStatus] = useState({
    phone_verified: false,
    sms_sent: false,
    sms_message: null as string | null,
    sms_expires_at: null as string | null,
  })

  // SMS送信状況を取得
  useEffect(() => {
    const fetchSmsStatus = async () => {
      if (!estimateId) {
        setIsLoadingSmsStatus(false)
        return
      }

      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
          }/api/verification/sms-status?estimate_id=${estimateId}`,
        )

        const result = await response.json()

        if (result.success) {
          setSmsStatus(result.data)

          // 既に電話認証済みの場合
          if (result.data.phone_verified) {
            setSmsVerificationStatus('success')
            setSmsVerificationMessage('電話番号の認証が完了しています')
          }
        } else {
          console.error('SMS status fetch failed:', result.message)
        }
      } catch (error) {
        console.error('SMS status fetch error:', error)
      } finally {
        setIsLoadingSmsStatus(false)
      }
    }

    fetchSmsStatus()
  }, [estimateId])

  // SMS認証コード検証
  const handleSmsVerification = async () => {
    if (!smsCode || smsCode.length !== 6) {
      setSmsVerificationStatus('error')
      setSmsVerificationMessage('6桁の認証コードを入力してください')
      return
    }

    setIsVerifyingSms(true)
    setSmsVerificationStatus('pending')

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/verification/verify-sms`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: smsCode,
          }),
        },
      )

      const result = await response.json()

      if (result.success) {
        setSmsVerificationStatus('success')
        setSmsVerificationMessage(result.message || 'SMS認証が完了しました')

        // 認証完了ページにリダイレクト
        if (result.redirect_url) {
          setTimeout(() => {
            window.location.href = result.redirect_url
          }, 2000) // 2秒後にリダイレクト
        }
      } else {
        setSmsVerificationStatus('error')
        setSmsVerificationMessage(result.message || 'SMS認証に失敗しました')
      }
    } catch (error) {
      console.error('SMS verification error:', error)
      setSmsVerificationStatus('error')
      setSmsVerificationMessage('SMS認証中にエラーが発生しました。しばらく時間をおいて再度お試しください。')
    } finally {
      setIsVerifyingSms(false)
    }
  }

  // SMS再送
  const handleResendSms = async () => {
    if (!estimateId) {
      setResendError('見積もりIDが見つかりません')
      return
    }

    setIsResendingSms(true)
    setResendMessage('')
    setResendError('')

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/verification/resend-sms`,
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

      const result = await response.json()

      if (result.success) {
        setResendMessage('SMS認証コードを再送しました。')
      } else {
        setResendError(result.message || 'SMS再送に失敗しました')
      }
    } catch (error) {
      console.error('SMS resend error:', error)
      setResendError('SMS再送中にエラーが発生しました。しばらく時間をおいて再度お試しください。')
    } finally {
      setIsResendingSms(false)
    }
  }

  // SMS認証完了時の表示
  if (smsVerificationStatus === 'success') {
    return (
      <div className="bg-green-50 rounded-lg p-6 border border-green-200">
        <div className="flex items-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-green-900">認証完了</h3>
            <p className="text-sm text-green-800">メールアドレスと電話番号の認証が完了しました！</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-green-900">今後の流れ</h4>
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
      </div>
    )
  }

  // ローディング中の表示
  if (isLoadingSmsStatus) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">SMS送信状況を確認中...</span>
        </div>
      </div>
    )
  }

  // SMS認証フォーム表示
  return (
    <div className="space-y-4">
      {/* SMS送信状況の表示 */}
      {smsStatus.sms_message && (
        <Alert className={smsStatus.sms_sent ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
          {smsStatus.sms_sent ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={smsStatus.sms_sent ? 'text-green-800' : 'text-red-800'}>
            {smsStatus.sms_message}
          </AlertDescription>
        </Alert>
      )}

      {/* SMS認証コード入力フォーム */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sms-code">SMS認証コード（6桁）</Label>
          <Input
            id="sms-code"
            type="text"
            placeholder="123456"
            value={smsCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6)
              setSmsCode(value)
            }}
            maxLength={6}
            className="text-center text-xl tracking-widest font-mono"
            disabled={isVerifyingSms}
          />
        </div>

        <Button onClick={handleSmsVerification} disabled={isVerifyingSms || smsCode.length !== 6} className="w-full">
          {isVerifyingSms ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              認証中...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              SMS認証を完了
            </>
          )}
        </Button>

        {/* SMS認証結果メッセージ */}
        {smsVerificationStatus === 'error' && smsVerificationMessage && (
          <Alert className="bg-red-50 border-red-200">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{smsVerificationMessage}</AlertDescription>
          </Alert>
        )}

        {/* SMS再送ボタン */}
        <div className="text-center">
          <Button onClick={handleResendSms} disabled={isResendingSms} variant="outline" size="sm">
            {isResendingSms ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                再送中...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                SMS認証コードを再送
              </>
            )}
          </Button>
        </div>

        {/* 再送成功メッセージ */}
        {resendMessage && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{resendMessage}</AlertDescription>
          </Alert>
        )}

        {/* 再送エラーメッセージ */}
        {resendError && (
          <Alert className="bg-red-50 border-red-200">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{resendError}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
