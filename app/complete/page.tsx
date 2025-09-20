import React from 'react'
import Link from 'next/link'
import { CheckCircle, AlertCircle, Users, Mail, Phone, AlertTriangle, Home, Clock, Trophy, Gavel } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CompletePage({ searchParams }: PageProps) {
  const params = await searchParams
  const estimateId = params.estimate_id as string | undefined

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-3">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* メインの完了カード */}
        <Card className="shadow-lg border-0 bg-white overflow-hidden pt-0">
          <CardHeader className="text-center px-4 py-6" style={{ backgroundColor: '#003672' }}>
            <div className="mx-auto mb-3">
              <CheckCircle className="h-16 w-16 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-white leading-tight">見積もり依頼が完了しました</CardTitle>
            <CardDescription className="text-blue-100 text-sm mt-2 leading-relaxed">
              メールアドレスと電話番号の認証が正常に完了し、
              <br />
              業者への見積もり依頼を受け付けました。
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 space-y-6">
            {/* 今後の流れ */}
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-bold text-gray-900 mb-1">今後の流れ</h2>
                <p className="text-sm text-gray-600">引越し業者との入札・連絡プロセス</p>
              </div>

              {/* ステップ1: 入札開始 */}
              <Card className="border-l-4 border-l-blue-600 bg-blue-50/30">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      1
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <Gavel className="h-4 w-4 text-blue-600" />
                        <h3 className="font-semibold text-gray-900 text-sm">業者による入札開始</h3>
                        <Badge variant="outline" className="text-xs text-blue-600 border-blue-300 px-2 py-0">
                          <Clock className="h-2.5 w-2.5 mr-1" />
                          1-3営業日
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        複数の引越し業者があなたの依頼内容を確認し、見積もり金額を入札します。
                        引越し内容、距離、時期を総合的に判断して最適な価格を提示します。
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ステップ2: 上位3社選出 */}
              <Card className="border-l-4 border-l-amber-600 bg-amber-50/30">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      2
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <Trophy className="h-4 w-4 text-amber-600" />
                        <h3 className="font-semibold text-gray-900 text-sm">上位3社の選出</h3>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed mb-2">
                        入札金額の<strong className="text-amber-700">安い順に上位3社</strong>が選出され、
                        これらの業者のみにあなたの連絡先が開示されます。
                      </p>
                      <Alert className="bg-amber-100 border-amber-300 p-2">
                        <Trophy className="h-3 w-3 text-amber-700" />
                        <AlertDescription className="text-amber-800 text-xs ml-1">
                          <strong>プライバシー保護:</strong> 上位3社以外には個人情報は開示されません
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ステップ3: 入札通知 */}
              <Card className="border-l-4 border-l-green-600 bg-green-50/30">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      3
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <Mail className="h-4 w-4 text-green-600" />
                        <h3 className="font-semibold text-gray-900 text-sm">入札情報のメール通知</h3>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed mb-2">
                        入札が行われるたびに、リアルタイムで入札情報をメールでお知らせします。
                      </p>
                      <div className="p-2 bg-green-100 rounded text-xs text-green-800">
                        📧 <strong>通知内容:</strong> 業者名、入札金額、入札時刻、現在の順位
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ステップ4: 業者からの連絡 */}
              <Card className="border-l-4 border-l-purple-600 bg-purple-50/30">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      4
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <Phone className="h-4 w-4 text-purple-600" />
                        <h3 className="font-semibold text-gray-900 text-sm">上位3社からの直接連絡</h3>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed mb-2">
                        上位3社の業者から直接お電話またはメールでご連絡いたします。
                      </p>
                      <div className="space-y-2">
                        <div className="p-2 bg-purple-100 rounded text-xs">
                          <div className="font-semibold text-purple-800 mb-1">📞 電話での連絡</div>
                          <div className="text-purple-700">詳細ヒアリング・訪問見積もり調整</div>
                        </div>
                        <div className="p-2 bg-purple-100 rounded text-xs">
                          <div className="font-semibold text-purple-800 mb-1">📧 メールでの連絡</div>
                          <div className="text-purple-700">詳細見積書送付・サービス内容説明</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Separator className="my-4" />

              {/* 重要な注意事項 */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-gray-900 flex items-center">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                  重要な注意事項
                </h3>

                <div className="space-y-3">
                  {/* 自由選択 */}
                  <Card className="border-green-200 bg-green-50/50">
                    <CardContent className="p-3">
                      <div className="flex items-start space-x-2">
                        <Users className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-green-800 text-sm mb-1">業者選択の自由</h4>
                          <p className="text-green-700 text-xs leading-relaxed">
                            <strong>あなたが最終決定権を持ちます。</strong>
                            <br />
                            価格だけでなく、サービス内容、対応の良さも総合的に判断して、
                            最もご納得いただける業者をお選びください。
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 運営への連絡 */}
                  <Card className="border-red-200 bg-red-50/50">
                    <CardContent className="p-3">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-red-800 text-sm mb-1">異常な金額の報告</h4>
                          <p className="text-red-700 text-xs leading-relaxed">
                            <strong>明らかに入札金額からかけ離れた金額の場合</strong>
                            <br />
                            入札金額と大きく異なる場合は、お手数ですが運営にご連絡ください。
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator className="my-4" />

              {/* サポート情報 */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-gray-900 text-center">サポート・お問い合わせ</h3>
                <div className="space-y-2">
                  <Card className="border-slate-200">
                    <CardContent className="p-3 text-center">
                      <h4 className="font-semibold text-slate-800 text-sm mb-1">📧 メールサポート</h4>
                      <p className="text-sm text-slate-700 mb-1">support@moving-auction.com</p>
                      <p className="text-xs text-slate-600">24時間受付・平日営業日内に回答</p>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200">
                    <CardContent className="p-3 text-center">
                      <h4 className="font-semibold text-slate-800 text-sm mb-1">📞 電話サポート</h4>
                      <p className="text-sm text-slate-700 mb-1">0120-XXX-XXX</p>
                      <p className="text-xs text-slate-600">平日 9:00-18:00</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* アクションボタン */}
              <div className="text-center pt-4">
                <Button asChild size="lg" className="w-full text-white" style={{ backgroundColor: '#003672' }}>
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    トップページに戻る
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* フッター情報 */}
        <div className="text-center text-xs text-gray-500 px-4 pb-4">
          <p className="mb-1">引越しオークションをご利用いただき、ありがとうございます。</p>
          <p>何かご不明な点がございましたら、お気軽にお問い合わせください。</p>
        </div>
      </div>
    </div>
  )
}
