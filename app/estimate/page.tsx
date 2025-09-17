'use client'

import React from 'react'
import Container from '@/components/common/page-parts/container'
import EstimateForm from '@/components/estimate/EstimateForm'
import { trackPageVisit } from '@/utils/pageTracking'

const EstimatePage = () => {
  // ページ訪問を追跡
  React.useEffect(() => {
    trackPageVisit('/estimate')
  }, [])

  return (
    <div className="min-h-screen bg-[#f7fafd]">
      <Container>
        <div className="py-16">
          {/* ヘッダーセクション */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[#003672] mb-4">見積もり依頼</h1>
            <p className="text-lg text-[#5c6f8b] mb-8">
              引越し情報を入力して、複数業者からの見積もりを受け取りましょう
            </p>

            {/* プログレスバー */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#003672]">STEP 1</span>
                <span className="text-sm text-[#5c6f8b]">情報入力</span>
              </div>
              <div className="w-full bg-[#e2e7e7] rounded-full h-2">
                <div className="bg-[#003672] h-2 rounded-full w-1/4"></div>
              </div>
            </div>
          </div>

          {/* フォームセクション */}
          <div className="max-w-4xl mx-auto">
            <EstimateForm />
          </div>
        </div>
      </Container>
    </div>
  )
}

export default EstimatePage
