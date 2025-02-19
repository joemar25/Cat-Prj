import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type React from 'react';

interface NCRModeSwitchProps {
  isNCRMode: boolean;
  setIsNCRMode: (checked: boolean) => void;
}

const NCRModeSwitch: React.FC<NCRModeSwitchProps> = ({
  isNCRMode,
  setIsNCRMode,
}) => {
  return (
    <div className='flex items-center space-x-2 my-2'>
      <Switch
        id='ncr-mode'
        checked={isNCRMode}
        onCheckedChange={setIsNCRMode}
        className='data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground'
      />
      <Label
        htmlFor='ncr-mode'
        className='text-xs text-muted-foreground cursor-pointer transition-colors hover:text-foreground'
      >
        National Capital Region
      </Label>
    </div>
  );
};

export default NCRModeSwitch;
