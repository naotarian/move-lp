import React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { LargeItemCheckboxProps } from '@/types/estimate'

const LargeItemCheckbox: React.FC<LargeItemCheckboxProps> = ({
  items,
  selectedItems,
  onSelectionChange,
  className = '',
}) => {
  const handleItemToggle = (item: string) => {
    const newSelection = selectedItems.includes(item)
      ? selectedItems.filter((selected) => selected !== item)
      : [...selectedItems, item]
    onSelectionChange(newSelection)
  }

  return (
    <div className={`md:col-span-2 ${className}`}>
      <label className="block text-sm font-medium text-[#003672] mb-2 cursor-pointer">大型家具・家電</label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((item) => (
          <label key={item} className="flex items-center space-x-2 cursor-pointer">
            <Checkbox id={item} checked={selectedItems.includes(item)} onCheckedChange={() => handleItemToggle(item)} />
            <span className="text-sm text-[#5c6f8b]">{item}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default LargeItemCheckbox
