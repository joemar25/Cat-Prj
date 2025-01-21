// src/lib/constants/civil-registrar-staff.tsx

export type CivilRegistrarStaff = {
  id: string;
  name: string;
  title: string;
  position: string;
};

export const CIVIL_REGISTRAR_STAFF: CivilRegistrarStaff[] = [
  {
    id: 'admin-3',
    name: 'Admin User 3',
    title: 'Civil Registry Department Head',
    position: 'Admin',
  },
  {
    id: 'admin-1',
    name: 'Admin User 1',
    title: 'Civil Registrar',
    position: 'Admin',
  },
  {
    id: 'admin-2',
    name: 'Admin User 2',
    title: 'Assistant Civil Registrar',
    position: 'Admin',
  },
  {
    id: 'staff-3',
    name: 'Staff User 3',
    title: 'Registration Officer',
    position: 'Staff',
  },
  {
    id: 'staff-4',
    name: 'Staff User 4',
    title: 'Document Processing Officer',
    position: 'Staff',
  },
  {
    id: 'staff-2',
    name: 'Staff User 2',
    title: 'Document Processing Officer',
    position: 'Staff',
  },
  {
    id: 'staff-1',
    name: 'Staff User 1',
    title: 'Registration Officer',
    position: 'Staff',
  },
].sort((a, b) => a.name.localeCompare(b.name));

export const COMMON_DATES = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'custom', label: 'Select Custom Date' },
];
