import React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { OptionCheckboxProps } from '@/types/estimate'

const OptionCheckbox: React.FC<OptionCheckboxProps> = ({
  options,
  selectedOptions,
  onSelectionChange,
  className = '',
}) => {
  const handleOptionToggle = (option: string) => {
    const newSelection = selectedOptions.includes(option)
      ? selectedOptions.filter((selected) => selected !== option)
      : [...selectedOptions, option]
    onSelectionChange(newSelection)
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-[#003672] mb-2 cursor-pointer">オプションサービス</label>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option} className="flex items-center space-x-2 cursor-pointer">
            <Checkbox
              id={option}
              checked={selectedOptions.includes(option)}
              onCheckedChange={() => handleOptionToggle(option)}
            />
            <span className="text-sm text-[#5c6f8b]">{option}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default OptionCheckbox
