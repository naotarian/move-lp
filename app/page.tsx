import Container from '@/components/common/page-parts/container'
import MainVisual from '@/components/top/mainVisual'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function Home() {
  return (
    <div>
      <MainVisual />

      {/* サービス特徴セクション */}
      <section className="py-16 bg-[#f7fafd]">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#003672] mb-4">MoveBidの特徴</h2>
            <p className="text-lg text-[#5c6f8b]">業者が競争で価格を提示、あなたは最適な選択をするだけ</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-[#003672]">上位3社とのみ連絡</h3>
              <Image
                src="/images/top/feature01.jpg"
                alt="MoveBid - 上位3社とのみ連絡"
                width={300}
                height={200}
                className="rounded-lg mb-4 w-full h-auto mx-auto"
              />
              <p className="text-[#5c6f8b]">
                入札した業者の中から、最も安い上位3社とだけ連絡を取ります。何十社もの業者からの電話攻勢に悩まされることはありません。
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-[#003672]">上限金額10%以内保証</h3>
              <Image
                src="/images/top/feature01.jpg"
                alt="MoveBid - 上位3社とのみ連絡"
                width={300}
                height={200}
                className="rounded-lg mb-4 w-full h-auto mx-auto"
              />
              <p className="text-[#5c6f8b]">
                あなたが設定した上限金額からの超過は最大10%以内で保証。「こんなに高くなるなんて聞いてない！」というトラブルを防げます。
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-[#003672]">簡単情報入力</h3>
              <Image
                src="/images/top/feature01.jpg"
                alt="MoveBid - 上位3社とのみ連絡"
                width={300}
                height={200}
                className="rounded-lg mb-4 w-full h-auto mx-auto"
              />
              <p className="text-[#5c6f8b]">
                引越し日、住所、荷物量などの基本情報を入力するだけでOK。後は業者が勝手に競争して、あなたに最適な価格を提示します。
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ご利用の流れ */}
      <section className="py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#003672] mb-4">ご利用の流れ</h2>
            <p className="text-lg text-[#5c6f8b]">わずか4ステップで理想の引越し業者が見つかります</p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
              {/* ステップ1 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-12 text-center relative">
                <div className="absolute rounded-t-lg top-0 left-0 w-full h-[30px] bg-[#7a9cc6] text-white flex items-center justify-center text-sm font-bold">
                  STEP1
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-3">情報入力</h4>
                <p className="text-xs text-gray-600">引越し日、住所、荷物量などの基本情報を簡単入力</p>

                {/* 右向き矢印 - デスクトップのみ */}
                <div className="hidden md:block absolute -right-6 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="flex items-center">
                    <div className="w-8 h-0.5 bg-[#7a9cc6]"></div>
                    <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[8px] border-t-transparent border-b-transparent border-l-[#7a9cc6]"></div>
                  </div>
                </div>
              </div>
              {/* モバイル用下向き三角形 */}
              <div className="md:hidden flex justify-center mt-4">
                <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[15px] border-l-transparent border-r-transparent border-t-[#7a9cc6]"></div>
              </div>

              {/* ステップ2 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-12 text-center relative">
                <div className="absolute rounded-t-lg top-0 left-0 w-full h-[30px] bg-[#6690b8] text-white flex items-center justify-center text-sm font-bold">
                  STEP2
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-3">業者が入札</h4>
                <p className="text-xs text-gray-600">全国の引越し業者があなたの案件に競争入札します</p>

                {/* 右向き矢印 - デスクトップのみ */}
                <div className="hidden md:block absolute -right-6 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="flex items-center">
                    <div className="w-8 h-0.5 bg-[#6690b8]"></div>
                    <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[8px] border-t-transparent border-b-transparent border-l-[#6690b8]"></div>
                  </div>
                </div>
              </div>
              {/* モバイル用下向き三角形 */}
              <div className="md:hidden flex justify-center mt-4">
                <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[15px] border-l-transparent border-r-transparent border-t-[#6690b8]"></div>
              </div>

              {/* ステップ3 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-12 text-center relative">
                <div className="absolute rounded-t-lg top-0 left-0 w-full h-[30px] bg-[#4f7ba3] text-white flex items-center justify-center text-sm font-bold">
                  STEP3
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-3">上位3社から連絡</h4>
                <p className="text-xs text-gray-600">最安値の上位3社から連絡が来るので、詳細を確認</p>

                {/* 右向き矢印 - デスクトップのみ */}
                <div className="hidden md:block absolute -right-6 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="flex items-center">
                    <div className="w-8 h-0.5 bg-[#4f7ba3]"></div>
                    <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[8px] border-t-transparent border-b-transparent border-l-[#4f7ba3]"></div>
                  </div>
                </div>
              </div>
              {/* モバイル用下向き三角形 */}
              <div className="md:hidden flex justify-center mt-4">
                <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[15px] border-l-transparent border-r-transparent border-t-[#4f7ba3]"></div>
              </div>

              {/* ステップ4 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-12 text-center relative">
                <div className="absolute rounded-t-lg top-0 left-0 w-full h-[30px] bg-[#003672] text-white flex items-center justify-center text-sm font-bold">
                  STEP4
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-3">最適な業者を選択</h4>
                <p className="text-xs text-gray-600">価格、サービス、信頼性を比較して最適な業者を決定</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* メリット・料金 */}
      <section className="py-16 bg-[#e2e7e7]">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#003672] mb-4">従来方式との比較</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-[#5c6f8b] mb-4 text-center">従来の見積もり</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="text-[#5c6f8b] mr-3">❌</span>
                  複数業者への個別連絡が必要
                </li>
                <li className="flex items-center">
                  <span className="text-[#5c6f8b] mr-3">❌</span>
                  価格交渉が困難
                </li>
                <li className="flex items-center">
                  <span className="text-[#5c6f8b] mr-3">❌</span>
                  時間と手間がかかる
                </li>
                <li className="flex items-center">
                  <span className="text-[#5c6f8b] mr-3">❌</span>
                  適正価格が分からない
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md border-2 border-[#003672]">
              <h3 className="text-2xl font-bold text-[#003672] mb-4 text-center">MoveBid</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="text-[#003672] mr-3">✅</span>
                  一度の申込みで完結
                </li>
                <li className="flex items-center">
                  <span className="text-[#003672] mr-3">✅</span>
                  業者同士が自動で競争
                </li>
                <li className="flex items-center">
                  <span className="text-[#003672] mr-3">✅</span>
                  最短10分で見積もり完了
                </li>
                <li className="flex items-center">
                  <span className="text-[#003672] mr-3">✅</span>
                  市場最安値を実現
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#003672] text-white">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">今すぐ無料で見積もり依頼</h2>
            <p className="text-lg mb-8">登録・利用料完全無料。最安値での引越しを今すぐ実現しましょう</p>
            <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
              <a
                href="/estimate"
                className="w-full md:w-auto bg-[#5c6f8b] hover:bg-[#003672] text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg"
              >
                見積もりを開始
              </a>
              <Button className="cursor-pointer font-semibold">お問い合わせ</Button>
            </div>
            <p className="text-sm text-[#e2e7e7] mt-6">※ 登録・利用料は一切かかりません</p>
          </div>
        </Container>
      </section>
    </div>
  )
}
