import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ZipcodeInputProps } from '@/types/estimate'

const ZipcodeInput: React.FC<ZipcodeInputProps> = ({
  label,
  zipcodeValue,
  prefectureValue,
  streetAddressValue,
  buildingDetailsValue,
  onZipcodeChange,
  onPrefectureChange,
  onStreetAddressChange,
  onBuildingDetailsChange,
  onAddressSearch,
  required = false,
  className = '',
  error,
  name,
}) => {
  return (
    <div className={`md:col-span-2 ${className}`} data-field={name || label}>
      <label className="block text-sm font-medium text-[#003672] mb-2 cursor-pointer">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="w-40">
            <Input
              type="text"
              placeholder="郵便番号"
              value={zipcodeValue}
              onChange={(e) => onZipcodeChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003672] focus:border-[#003672] outline-none transition-colors"
              maxLength={8}
            />
            <p className="text-xs text-[#5c6f8b] mt-1">例: 150-0002</p>
          </div>
          <Button type="button" onClick={onAddressSearch}>
            住所検索
          </Button>
        </div>
        <Input
          placeholder="都道府県市区町村"
          value={prefectureValue}
          onChange={(e) => onPrefectureChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003672] focus:border-[#003672] outline-none transition-colors"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            placeholder="番地（必須）"
            value={streetAddressValue}
            onChange={(e) => onStreetAddressChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003672] focus:border-[#003672] outline-none transition-colors"
            required
          />
          <Input
            placeholder="建物名・部屋番号（任意）"
            value={buildingDetailsValue}
            onChange={(e) => onBuildingDetailsChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003672] focus:border-[#003672] outline-none transition-colors"
          />
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

export default ZipcodeInput
