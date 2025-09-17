import React, { useEffect, useState } from 'react'
import { LuggageItem } from '@/types/estimate'
import { Button } from '@/components/ui/button'
import { Minus, Plus } from 'lucide-react'
import { getLuggageData, LuggageCategoryWithItems } from '@/lib/luggage-data'

interface LuggageSelectorProps {
  selectedItems: LuggageItem[]
  onQuantityChange: (item: LuggageItem, quantity: number) => void
  className?: string
}

const LuggageSelector: React.FC<LuggageSelectorProps> = ({ selectedItems, onQuantityChange, className = '' }) => {
  const [luggageData, setLuggageData] = useState<LuggageCategoryWithItems[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLuggageData = async () => {
      try {
        const data = await getLuggageData()
        console.log(data)
        setLuggageData(data)
      } catch (error) {
        console.error('Failed to load luggage data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadLuggageData()
  }, [])

  if (loading) {
    return <div className="p-4 text-center">荷物データを読み込み中...</div>
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {luggageData.map((category) => (
        <div key={category.id} className="space-y-4">
          <h3 className="text-lg font-semibold text-[#003672] border-b border-gray-200 pb-2">{category.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.items.map((item) => {
              const selectedItem = selectedItems.find((selected) => selected.id === item.id)
              const quantity = selectedItem?.quantity || 0

              // LuggageItem型に変換
              const luggageItem: LuggageItem = {
                ...item,
                quantity,
                category: category.code,
              }

              return (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  {/* アイコンエリア（仮） */}
                  <div className="flex items-center justify-center h-16 mb-3 bg-gray-100 rounded-lg">
                    <span className="text-gray-400 text-sm">{item.name}</span>
                  </div>

                  {/* アイテム名 */}
                  <div className="text-center mb-3">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    {item.subLabel && <p className="text-sm text-gray-500">{item.subLabel}</p>}
                  </div>

                  {/* 数量選択 */}
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onQuantityChange(luggageItem, Math.max(0, quantity - 1))}
                      disabled={quantity <= 0}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center justify-center w-12 h-8">
                      <input
                        type="number"
                        min="0"
                        value={quantity}
                        readOnly
                        className={`w-full h-full text-center border rounded ${
                          quantity > 0
                            ? 'bg-green-100 border-green-300 text-green-800'
                            : 'bg-white border-gray-300 text-gray-700'
                        } focus:outline-none focus:ring-2 focus:ring-[#003672] focus:border-transparent`}
                      />
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onQuantityChange(luggageItem, quantity + 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default LuggageSelector
