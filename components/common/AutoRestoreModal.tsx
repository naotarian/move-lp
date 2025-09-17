'use client'

import React from 'react'

interface AutoRestoreModalProps {
  isOpen: boolean
  onAccept: () => void
  onDecline: () => void
}

const AutoRestoreModal: React.FC<AutoRestoreModalProps> = ({ isOpen, onAccept, onDecline }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4 bg-white/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">入力データの復元</h3>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">前回の入力データが見つかりました。</p>
            <p className="text-sm text-gray-600">このデータを自動入力しますか？</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onAccept}
              className="flex-1 bg-[#003672] hover:bg-[#5c6f8b] text-white font-bold py-2 px-4 rounded-lg transition-colors text-center cursor-pointer"
            >
              自動入力する
            </button>
            <button
              type="button"
              onClick={onDecline}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors text-center cursor-pointer"
            >
              新規で入力する
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-3 text-center">※ 新規で入力する場合、前回のデータは削除されます</p>
        </div>
      </div>
    </div>
  )
}

export default AutoRestoreModal
