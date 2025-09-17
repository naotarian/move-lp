'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Home } from 'lucide-react'

export default function ThanksPage() {
  const searchParams = useSearchParams()
  const estimateId = searchParams.get('id')

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

          {/* メッセージ */}
          <div className="space-y-4 text-gray-600">
            <p className="text-lg">ご依頼いただいた見積もりについて、複数の業者から見積もりが届きます。</p>
            <p className="text-sm">見積もり結果は、ご登録いただいたメールアドレスにご連絡いたします。</p>
            {estimateId && <p className="text-sm font-mono bg-gray-100 px-3 py-2 rounded">依頼ID: {estimateId}</p>}
          </div>

          {/* 次のステップ */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">今後の流れ</h3>
            <ol className="text-sm text-blue-800 space-y-2">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  1
                </span>
                複数の業者から見積もりが届きます（通常1-3営業日）
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  2
                </span>
                見積もり内容を比較して、お気に入りの業者を選択
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  3
                </span>
                選んだ業者と直接やり取りして、引越しの詳細を決定
              </li>
            </ol>
          </div>

          {/* アクションボタン */}
          <div className="mt-8">
            <Link
              href="/"
              className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#003672] hover:bg-[#5c6f8b] transition-colors duration-200"
            >
              <Home className="w-5 h-5 mr-2" />
              ホームに戻る
            </Link>
          </div>

          {/* 注意事項 */}
          <div className="mt-8 text-xs text-gray-500">
            <p>※ 見積もり依頼に関するお問い合わせは、お電話またはメールでお願いいたします。</p>
          </div>
        </div>
      </div>
    </div>
  )
}
