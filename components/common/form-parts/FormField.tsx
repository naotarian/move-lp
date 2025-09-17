import React from 'react'
import { useState } from 'react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  label: string
  type?: 'text' | 'email' | 'tel' | 'password' | 'date' | 'select' | 'textarea'
  placeholder?: string
  value?: string | Date
  onChange?: (value: string | Date | string[] | undefined) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  required?: boolean
  disabled?: boolean
  maxLength?: number
  rows?: number
  options?: readonly { value: string; label: string }[]
  error?: string
  id?: string
  name?: string
  className?: string
  children?: React.ReactNode
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  required = false,
  disabled = false,
  maxLength,
  rows = 8,
  options,
  error,
  id,
  name,
  className = '',
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const renderField = () => {
    if (children) {
      return children
    }

    if (type === 'date') {
      const dateValue = value instanceof Date ? value : value ? new Date(value) : undefined

      return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn('w-full justify-start text-left font-normal', !dateValue && 'text-muted-foreground')}
              disabled={disabled}
              id={id}
              name={name}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateValue ? (
                format(dateValue, 'yyyy年M月d日', { locale: ja })
              ) : (
                <span>{placeholder || '日付を選択してください'}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateValue}
              onSelect={(date) => {
                onChange?.(date)
                setIsOpen(false) // 日付選択時にカレンダーを閉じる
              }}
              disabled={disabled || ((date) => date < new Date(new Date().setHours(0, 0, 0, 0)))}
              captionLayout="dropdown"
              locale={ja}
            />
          </PopoverContent>
        </Popover>
      )
    }

    if (type === 'select') {
      return (
        <Select
          value={typeof value === 'string' ? value : ''}
          onValueChange={(val) => onChange?.(val)}
          disabled={disabled}
          name={name}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder || '選択してください'} />
          </SelectTrigger>
          <SelectContent>
            {options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    if (type === 'textarea') {
      return (
        <Textarea
          placeholder={placeholder}
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur as (e: React.FocusEvent<HTMLTextAreaElement>) => void}
          disabled={disabled}
          rows={rows}
          id={id}
          name={name}
          className={cn('resize-none min-h-32', className)}
        />
      )
    }

    return (
      <Input
        type={type as 'text' | 'email' | 'tel' | 'password'}
        placeholder={placeholder}
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur as (e: React.FocusEvent<HTMLInputElement>) => void}
        disabled={disabled}
        maxLength={maxLength}
        id={id}
        name={name}
      />
    )
  }

  return (
    <div className={className} data-field={name || label}>
      <label className="block text-sm font-medium text-[#003672] mb-2 cursor-pointer">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderField()}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

export default FormField
