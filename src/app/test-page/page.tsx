// LocationSelect.tsx
'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  getAllProvinces,
  getCitiesAndMunicipalitiesByProvinceId,
} from '@/lib/utils/location-helpers';
import { useState } from 'react';

export default function LocationSelect() {
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [isNCRMode, setIsNCRMode] = useState(false);

  const provinces = getAllProvinces();
  const cities = selectedProvince
    ? getCitiesAndMunicipalitiesByProvinceId(selectedProvince)
    : [];

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    setSelectedCity(''); // Reset city selection when province changes
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
  };

  const handleNCRModeChange = (value: boolean) => {
    setIsNCRMode(value);
    setSelectedProvince(value ? 'region-1' : '');
    setSelectedCity('');
  };

  const isNCRSelected = selectedProvince === 'region-1';

  return (
    <TooltipProvider>
      <div className='w-full max-w-md space-y-4 p-4'>
        {/* NCR Switch */}
        <div className='flex items-center space-x-2'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Switch
                checked={isNCRMode}
                onCheckedChange={handleNCRModeChange}
                className={`bg-gray-200 border-gray-200 hover:bg-gray-300 ${
                  isNCRMode ? 'bg-blue-600 hover:bg-blue-700' : ''
                }`}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Switch to NCR</p>
            </TooltipContent>
          </Tooltip>
          <label className='text-sm font-medium'>NCR Mode</label>
        </div>

        {/* Region/Province Select */}
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>
            {isNCRSelected ? 'Region' : 'Province'}
          </label>
          <Select
            onValueChange={handleProvinceChange}
            value={selectedProvince}
            disabled={isNCRMode}
          >
            <SelectTrigger className='w-full'>
              <SelectValue
                placeholder={
                  isNCRSelected ? 'Select a region' : 'Select a province'
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>
                  {isNCRSelected ? 'Regions' : 'Provinces'}
                </SelectLabel>
                {provinces.map((province) => (
                  <SelectItem key={province.id} value={province.id}>
                    {province.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* City/Municipality Select */}
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>
            City/Municipality
          </label>
          <Select
            onValueChange={handleCityChange}
            value={selectedCity}
            disabled={!selectedProvince}
          >
            <SelectTrigger className='w-full'>
              <SelectValue
                placeholder={
                  selectedProvince
                    ? 'Select a city/municipality'
                    : 'Select a region/province first'
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Cities/Municipalities</SelectLabel>
                {cities.map((city) => (
                  <SelectItem key={city.name} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Selection Display */}
        {(selectedProvince || selectedCity) && (
          <div className='mt-6 p-4 border rounded-md bg-gray-50'>
            <h3 className='font-medium mb-2'>Selected Location:</h3>
            {selectedProvince && (
              <p className='text-sm'>
                {isNCRSelected ? 'Region' : 'Province'}:{' '}
                {provinces.find((p) => p.id === selectedProvince)?.name}
              </p>
            )}
            {selectedCity && (
              <p className='text-sm'>City/Municipality: {selectedCity}</p>
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
