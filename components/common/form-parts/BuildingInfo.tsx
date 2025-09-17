import React from 'react'
import { FormField } from '@/components/common/form-parts'
import { ButtonRadioGroup } from '@/components/ui/button-radio'
import {
  BUILDING_TYPE_OPTIONS,
  BUILDING_ROOM_LAYOUT_OPTIONS,
  FLOOR_OPTIONS,
  ELEVATOR_OPTIONS,
} from '@/constants/estimate'

interface BuildingInfoProps {
  buildingType: string
  roomLayout: string
  floor: string
  elevator: string
  onBuildingTypeChange: (value: string) => void
  onRoomLayoutChange: (value: string) => void
  onFloorChange: (value: string) => void
  onElevatorChange: (value: string) => void
  errors?: {
    buildingType?: string
    roomLayout?: string
    floor?: string
    elevator?: string
  }
  className?: string
}

const BuildingInfo: React.FC<BuildingInfoProps> = ({
  buildingType,
  roomLayout,
  floor,
  elevator,
  onBuildingTypeChange,
  onRoomLayoutChange,
  onFloorChange,
  onElevatorChange,
  errors = {},
  className = '',
}) => {
  // 建物タイプ変更時の処理
  const handleBuildingTypeChange = (value: string) => {
    onBuildingTypeChange(value)

    if (value === 'house') {
      // 戸建ての場合は階数を1階に固定
      onFloorChange('1')
    } else {
      // 戸建て以外に変更された場合、階数を初期化
      onFloorChange('')
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-[#003672] mb-2 cursor-pointer">
          建物のタイプ <span className="text-red-500 ml-1">*</span>
        </label>
        <ButtonRadioGroup
          options={BUILDING_TYPE_OPTIONS}
          value={buildingType}
          onChange={handleBuildingTypeChange}
          name="buildingType"
          error={errors.buildingType}
        />
      </div>

      <FormField
        label="間取り"
        type="select"
        options={BUILDING_ROOM_LAYOUT_OPTIONS}
        value={roomLayout}
        onChange={(value) => onRoomLayoutChange(value as string)}
        name="roomLayout"
        required
        error={errors.roomLayout}
      />

      <FormField
        label="お住まいの階数"
        type="select"
        options={FLOOR_OPTIONS}
        value={floor}
        onChange={(value) => onFloorChange(value as string)}
        name="floor"
        disabled={buildingType === 'house'}
        className={buildingType === 'house' ? 'opacity-50' : ''}
        required
        error={errors.floor}
      />
      {buildingType === 'house' && <p className="text-xs text-[#5c6f8b] -mt-2">※マンション・アパートの場合のみ</p>}

      <div>
        <label className="block text-sm font-medium text-[#003672] mb-2 cursor-pointer">
          エレベーター <span className="text-red-500 ml-1">*</span>
        </label>
        <ButtonRadioGroup
          options={ELEVATOR_OPTIONS}
          value={elevator}
          onChange={onElevatorChange}
          name="elevator"
          error={errors.elevator}
        />
      </div>
    </div>
  )
}

export default BuildingInfo
