import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLocationSelector } from '@/hooks/use-location-selector';
import { LocationSelectorProps } from '@/lib/types/location-selector';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

const LocationSelector: React.FC<LocationSelectorProps> = ({
  provinceFieldName = 'province',
  municipalityFieldName = 'cityMunicipality',
  barangayFieldName = 'barangay',
  provinceLabel = 'Province',
  municipalityLabel = 'City/Municipality',
  barangayLabel = 'Barangay',
  isNCRMode = false,
  showBarangay = false,
  provincePlaceholder = 'Type province name...',
  municipalityPlaceholder = 'Type city/municipality name...',
  barangayPlaceholder = 'Type barangay name...',
  onProvinceChange,
  onMunicipalityChange,
  onBarangayChange,
  formItemClassName = '',
  formLabelClassName = '',
}) => {
  // Extract isSubmitted so we know when to show errors.
  const {
    control,
    setValue,
    trigger,
    formState: { isSubmitted },
  } = useFormContext();

  const [provinceInput, setProvinceInput] = useState('');
  const [municipalityInput, setMunicipalityInput] = useState('');
  const [barangayInput, setBarangayInput] = useState('');
  const [showProvinceSuggestions, setShowProvinceSuggestions] = useState(false);
  const [showMunicipalitySuggestions, setShowMunicipalitySuggestions] =
    useState(false);
  const [showBarangaySuggestions, setShowBarangaySuggestions] = useState(false);

  const {
    provinces = [],
    municipalities = [], // Combined suggestions (LocationSuggestion[])
    barangays = [],
    handleProvinceChange,
    handleMunicipalityChange,
    handleBarangayChange,
  } = useLocationSelector({
    provinceFieldName,
    municipalityFieldName,
    barangayFieldName,
    isNCRMode,
    showBarangay,
    setValue,
    onProvinceChange,
    onMunicipalityChange,
    onBarangayChange,
    trigger,
  });

  // Reset local inputs when mode changes.
  useEffect(() => {
    setProvinceInput('');
    setMunicipalityInput('');
    setBarangayInput('');
    setValue(provinceFieldName, '');
    setValue(municipalityFieldName, '');
    if (barangayFieldName) setValue(barangayFieldName, '');
    setShowProvinceSuggestions(false);
    setShowMunicipalitySuggestions(false);
    setShowBarangaySuggestions(false);
  }, [
    isNCRMode,
    provinceFieldName,
    municipalityFieldName,
    barangayFieldName,
    setValue,
  ]);

  // Matching function for provinces using the "name" property.
  const getMatchingItems = (input: string, items: any[] = []) => {
    if (!input) return [];
    const lowerInput = input.toLowerCase();
    return items
      .filter((item) => item.name?.toLowerCase().includes(lowerInput))
      .slice(0, 3);
  };

  // For municipalities we match against the suggestion's displayName.
  const getMatchingMunicipalityItems = (input: string, items: any[] = []) => {
    if (!input) return [];
    const lowerInput = input.toLowerCase();
    return items
      .filter((item) => item.displayName?.toLowerCase().includes(lowerInput))
      .slice(0, 5);
  };

  // Debounced suggestion display functions.
  const debouncedShowProvinceSuggestions = useCallback(
    debounce((value: string) => {
      setShowProvinceSuggestions(
        !!value && getMatchingItems(value, provinces).length > 0
      );
    }, 500),
    [provinces]
  );

  const debouncedShowMunicipalitySuggestions = useCallback(
    debounce((value: string) => {
      setShowMunicipalitySuggestions(
        !!value &&
          getMatchingMunicipalityItems(value, municipalities).length > 0
      );
    }, 500),
    [municipalities]
  );

  const debouncedShowBarangaySuggestions = useCallback(
    debounce((value: string) => {
      setShowBarangaySuggestions(
        !!value && getMatchingItems(value, barangays).length > 0
      );
    }, 500),
    [barangays]
  );

  useEffect(() => {
    return () => {
      debouncedShowProvinceSuggestions.cancel();
      debouncedShowMunicipalitySuggestions.cancel();
      debouncedShowBarangaySuggestions.cancel();
    };
  }, [
    debouncedShowProvinceSuggestions,
    debouncedShowMunicipalitySuggestions,
    debouncedShowBarangaySuggestions,
  ]);

  const dropdownClassName =
    'absolute w-full z-50 border rounded-md shadow-md mt-1 max-h-[200px] overflow-auto bg-white dark:bg-gray-950 dark:border-gray-800 text-sm';
  const dropdownItemClassName =
    'px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-100 text-sm';

  const handleInputChange = (
    value: string,
    setInput: (value: string) => void,
    debouncedShow: (value: string) => void,
    fieldName: string
  ) => {
    setInput(value);
    setValue(fieldName, value);
    debouncedShow(value);
  };

  // ---------------------------
  // New: Auto-match province onBlur
  // ---------------------------
  const handleProvinceBlur = () => {
    const trimmedInput = provinceInput.trim();
    // Try to find an exact match (case-insensitive) in the provinces list.
    const match = provinces.find(
      (p: any) => p.name.toLowerCase() === trimmedInput.toLowerCase()
    );
    if (match) {
      // If a match is found, update the input and trigger the change.
      setProvinceInput(match.name);
      setValue(provinceFieldName, match.name);
      handleProvinceChange(match.id);
      // Reset municipality and barangay when province is matched.
      setMunicipalityInput('');
      setValue(municipalityFieldName, '');
      if (barangayFieldName) {
        setBarangayInput('');
        setValue(barangayFieldName, '');
      }
    } else {
      // If no valid province is found, clear the municipality.
      setMunicipalityInput('');
      setValue(municipalityFieldName, '');
      if (barangayFieldName) {
        setBarangayInput('');
        setValue(barangayFieldName, '');
      }
    }
    // Hide suggestions after a short delay.
    setTimeout(() => setShowProvinceSuggestions(false), 200);
  };

  // ---------------------------
  // Update municipality disabled logic:
  // Disable if not in NCR mode and no valid province is selected.
  // ---------------------------
  const isProvinceValid =
    isNCRMode ||
    provinces.some(
      (p: any) => p.name.toLowerCase() === provinceInput.trim().toLowerCase()
    );

  return (
    <>
      {/* Province Field */}
      <FormField
        control={control}
        name={provinceFieldName}
        render={() => (
          <FormItem className={formItemClassName}>
            <FormLabel className={formLabelClassName}>
              {isNCRMode ? 'Region' : provinceLabel}
            </FormLabel>
            <div className='relative'>
              <FormControl>
                <Input
                  className='text-sm dark:bg-gray-950 dark:text-gray-100 dark:border-gray-800'
                  placeholder={isNCRMode ? 'Metro Manila' : provincePlaceholder}
                  disabled={isNCRMode}
                  value={provinceInput}
                  onChange={(e) =>
                    handleInputChange(
                      e.target.value,
                      setProvinceInput,
                      debouncedShowProvinceSuggestions,
                      provinceFieldName
                    )
                  }
                  onBlur={handleProvinceBlur}
                />
              </FormControl>
              {showProvinceSuggestions && provinceInput && (
                <div className={dropdownClassName}>
                  {getMatchingItems(provinceInput, provinces).map(
                    (prov: any) => (
                      <div
                        key={prov.id}
                        className={dropdownItemClassName}
                        onClick={() => {
                          // When a suggestion is clicked, update province
                          // and reset municipality (and barangay) values.
                          setProvinceInput(prov.name);
                          setValue(provinceFieldName, prov.name);
                          handleProvinceChange(prov.id);
                          setMunicipalityInput('');
                          setValue(municipalityFieldName, '');
                          if (barangayFieldName) {
                            setBarangayInput('');
                            setValue(barangayFieldName, '');
                          }
                          setShowProvinceSuggestions(false);
                        }}
                      >
                        {prov.name}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Municipality Field */}
      <FormField
        control={control}
        name={municipalityFieldName}
        render={({ field, fieldState }) => {
          // Only show error styling if the form has been submitted.
          const showError = isSubmitted && fieldState.error;
          return (
            <FormItem className={formItemClassName}>
              {/* Conditionally add a non-error text color if not showing error */}
              <FormLabel
                className={`${formLabelClassName} ${
                  !showError ? 'text-neutral-800' : ''
                }`}
                aria-invalid={showError ? 'true' : 'false'}
              >
                {municipalityLabel}
              </FormLabel>
              <div className='relative'>
                <FormControl>
                  <Input
                    {...field}
                    aria-invalid={showError ? 'true' : 'false'}
                    className='text-sm dark:bg-gray-950 dark:text-gray-100 dark:border-gray-800'
                    placeholder={municipalityPlaceholder}
                    disabled={!isProvinceValid}
                    value={municipalityInput}
                    onChange={(e) =>
                      handleInputChange(
                        e.target.value,
                        setMunicipalityInput,
                        debouncedShowMunicipalitySuggestions,
                        municipalityFieldName
                      )
                    }
                    onBlur={() =>
                      setTimeout(
                        () => setShowMunicipalitySuggestions(false),
                        200
                      )
                    }
                  />
                </FormControl>
                {showMunicipalitySuggestions && municipalityInput && (
                  <div className={dropdownClassName}>
                    {getMatchingMunicipalityItems(
                      municipalityInput,
                      municipalities
                    ).map((loc: any) => (
                      <div
                        key={loc.id}
                        className={dropdownItemClassName}
                        onClick={() => {
                          setMunicipalityInput(loc.displayName);
                          setValue(municipalityFieldName, loc.displayName);
                          handleMunicipalityChange(loc.displayName);
                          setShowMunicipalitySuggestions(false);
                        }}
                      >
                        {loc.displayName}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {showError && (
                <FormMessage>{fieldState.error?.message}</FormMessage>
              )}
            </FormItem>
          );
        }}
      />

      {/* Barangay Field */}
      {showBarangay && (
        <FormField
          control={control}
          name={barangayFieldName}
          render={({ field, fieldState }) => (
            <FormItem className={formItemClassName}>
              <FormLabel className={formLabelClassName}>
                {barangayLabel}
              </FormLabel>
              <div className='relative'>
                <FormControl>
                  <Input
                    className='dark:bg-gray-950 dark:text-gray-100 dark:border-gray-800'
                    placeholder={barangayPlaceholder}
                    disabled={!municipalityInput}
                    value={barangayInput}
                    onChange={(e) =>
                      handleInputChange(
                        e.target.value,
                        setBarangayInput,
                        debouncedShowBarangaySuggestions,
                        barangayFieldName
                      )
                    }
                    onBlur={() =>
                      setTimeout(() => setShowBarangaySuggestions(false), 200)
                    }
                  />
                </FormControl>
                {showBarangaySuggestions && barangayInput && (
                  <div className={dropdownClassName}>
                    {getMatchingItems(barangayInput, barangays).map(
                      (b: any) => (
                        <div
                          key={b.name}
                          className={dropdownItemClassName}
                          onClick={() => {
                            setBarangayInput(b.name);
                            setValue(barangayFieldName, b.name);
                            handleBarangayChange(b.name);
                            setShowBarangaySuggestions(false);
                          }}
                        >
                          {b.name}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
              {/* Only show error message after submission */}
              {isSubmitted && (
                <FormMessage>{fieldState.error?.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default LocationSelector;
