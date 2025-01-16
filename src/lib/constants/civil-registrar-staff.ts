// src/lib/constants/civil-registrar-staff.tsx
export type CivilRegistrarStaff = {
  id: string
  name: string
  title: string
  position: string
}

export const CIVIL_REGISTRAR_STAFF: CivilRegistrarStaff[] = [
  {
    id: 'staff-1',
    name: 'Scott Andrew Bedis',
    title: 'Software Developer',
    position: 'Software Developer',
  },
  {
    id: 'staff-2',
    name: 'Joemar Cardiño',
    title: 'Software Developer',
    position: 'Software Developer',
  },
  {
    id: 'staff-3',
    name: 'Arlo John Mercado',
    title: 'Software Developer',
    position: 'Software Developer',
  },
  {
    id: 'staff-4',
    name: 'JC Bea',
    title: 'Software Developer',
    position: 'Software Developer',
  },
  {
    id: 'staff-5',
    name: 'Martin Joseph Bolañas',
    title: 'Staff at the Civil Registry',
    position: 'Staff at the Civil Registry',
  },
  {
    id: 'staff-6',
    name: 'Jan Carlo Catampongan',
    title: 'Staff at the Civil Registry',
    position: 'Staff at the Civil Registry',
  },
  {
    id: 'staff-7',
    name: 'Allen Santonia',
    title: 'Staff at the Civil Registry',
    position: 'Staff at the Civil Registry',
  },
].sort((a, b) => a.name.localeCompare(b.name))

export const COMMON_DATES = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'custom', label: 'Select Custom Date' },
]
