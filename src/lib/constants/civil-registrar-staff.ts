// src/lib/constants/civil-registrar-staff.tsx
export type CivilRegistrarStaff = {
  id: string;
  name: string;
  title: string;
  position: string;
};

export const COMMON_DATES = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'custom', label: 'Select Custom Date' },
];
