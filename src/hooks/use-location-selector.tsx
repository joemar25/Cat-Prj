// src/hooks/use-location-selector.ts
import { UseFormSetValue } from 'react-hook-form'
import { useEffect, useMemo, useState } from 'react'
import { getAllProvinces, getBarangaysByLocation, getBarangaysBySubMunicipality, getCombinedCitySuggestions, LocationSuggestion, Province } from '@/lib/utils/location-helpers'

interface UseLocationSelectorProps {
  provinceFieldName: string
  municipalityFieldName: string
  barangayFieldName?: string
  isNCRMode: boolean
  showBarangay?: boolean
  setValue: UseFormSetValue<any>
  onProvinceChange?: (province: string) => void
  onMunicipalityChange?: (municipality: string) => void
  onBarangayChange?: (barangay: string) => void
  trigger?: (name: string | string[]) => Promise<boolean>
}

export const useLocationSelector = ({
  provinceFieldName,
  municipalityFieldName,
  barangayFieldName,
  isNCRMode,
  setValue,
  onProvinceChange,
  onMunicipalityChange,
  onBarangayChange,
  trigger,
}: UseLocationSelectorProps) => {
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedMunicipality, setSelectedMunicipality] = useState('')
  const [selectedBarangay, setSelectedBarangay] = useState('')
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)

  // Memoize provinces so they remain stable.
  const provinces: Province[] = useMemo(() => getAllProvinces(), [])

  // Instead of separate "municipalities", we now compute combined suggestions.
  const municipalities: LocationSuggestion[] = useMemo(() => {
    if (!selectedProvince) return []
    return getCombinedCitySuggestions(selectedProvince, isNCRMode)
  }, [selectedProvince, isNCRMode])

  // Memoize barangays based on selected municipality.
  const barangays = useMemo(() => {
    if (!selectedMunicipality) return []
    if (selectedMunicipality.includes(', ')) {
      const [subMun, locationName] = selectedMunicipality.split(', ')
      return getBarangaysBySubMunicipality(
        `${selectedProvince}-${locationName}`.toLowerCase(),
        subMun
      ).map((barangay) => ({ name: barangay.name }))
    }
    return getBarangaysByLocation(
      `${selectedProvince}-${selectedMunicipality}`.toLowerCase()
    ).map((barangay) => ({ name: barangay.name }))
  }, [selectedProvince, selectedMunicipality])

  // Reset effect for NCR mode.
  // This effect is now keyed only on isNCRMode (and static props) so that it does not run when selectedProvince changes.
  useEffect(() => {
    if (isNCRMode) {
      const ncrProvince = provinces.find(
        (p) => p.regionName === 'NATIONAL CAPITAL REGION (NCR)'
      )
      if (ncrProvince && selectedProvince !== ncrProvince.id) {
        setSelectedProvince(ncrProvince.id)
        setValue(provinceFieldName, ncrProvince.name)
        // Reset municipality and barangay when province changes.
        setSelectedMunicipality('')
        setSelectedBarangay('')
        setValue(municipalityFieldName, '')
        if (barangayFieldName) setValue(barangayFieldName, '')
      }
    } else {
      // When switching from NCR to non-NCR, clear the selections.
      setSelectedProvince('')
      setSelectedMunicipality('')
      setSelectedBarangay('')
      setValue(provinceFieldName, '')
      setValue(municipalityFieldName, '')
      if (barangayFieldName) setValue(barangayFieldName, '')
    }
  }, [
    isNCRMode,
    provinceFieldName,
    municipalityFieldName,
    barangayFieldName,
    setValue,
  ])

  // Handler for province changes.
  // When the province changes, we clear the municipality (and barangay) values.
  const handleProvinceChange = async (value: string) => {
    if (value === selectedProvince) return
    setSelectedProvince(value)
    // Reset municipality and barangay upon province change.
    setSelectedMunicipality('')
    setSelectedBarangay('')
    const selectedProvinceName =
      provinces.find((p) => p.id === value)?.name || ''
    setValue(provinceFieldName, selectedProvinceName)
    setValue(municipalityFieldName, '')
    if (barangayFieldName) setValue(barangayFieldName, '')
    if (trigger) {
      await trigger(provinceFieldName)
      await trigger(municipalityFieldName)
    }
    onProvinceChange?.(selectedProvinceName)
  }

  const handleMunicipalityChange = async (value: string) => {
    if (value === selectedMunicipality) return
    setSelectedMunicipality(value)
    setSelectedBarangay('')
    setValue(municipalityFieldName, value)
    if (barangayFieldName) setValue(barangayFieldName, '')
    if (trigger) {
      await trigger(municipalityFieldName)
    }
    onMunicipalityChange?.(value)
  }

  const handleBarangayChange = async (value: string) => {
    if (value === selectedBarangay) return
    setSelectedBarangay(value)
    if (barangayFieldName) setValue(barangayFieldName, value)
    if (trigger && barangayFieldName) {
      await trigger(barangayFieldName)
    }
    onBarangayChange?.(value)
  }

  return {
    selectedProvince,
    selectedMunicipality,
    selectedBarangay,
    hoveredCity,
    provinces,
    municipalities,
    barangays,
    handleProvinceChange,
    handleMunicipalityChange,
    handleBarangayChange,
    setHoveredCity,
  }
}
