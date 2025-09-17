import React from 'react'
import { FormSectionProps } from '@/types/estimate'

const FormSection: React.FC<FormSectionProps> = ({ title, description, children, className = '' }) => {
  return (
    <div className={`mb-10 ${className}`}>
      <h2 className="text-xl font-bold text-[#003672] mb-6 border-b-2 border-[#003672] pb-2">{title}</h2>
      {description && <p className="text-sm text-[#5c6f8b] mb-6">{description}</p>}
      {children}
    </div>
  )
}

export default FormSection
