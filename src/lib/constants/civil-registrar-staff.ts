// src/lib/constants/civil-registrar-staff.tsx

export type CivilRegistrarStaff = {
  id: string;
  name: string;
  title: string;
  position: string;
};

export const CIVIL_REGISTRAR_STAFF: CivilRegistrarStaff[] = [
  // Verification Officers
  {
    id: 'verification-officer-3',
    name: 'Verification Officer 3',
    title: 'Senior Verification Officer',
    position: 'Verification Officer',
  },
  {
    id: 'verification-officer-2',
    name: 'Verification Officer 2',
    title: 'Verification Officer',
    position: 'Verification Officer',
  },
  {
    id: 'verification-officer-1',
    name: 'Verification Officer 1',
    title: 'Junior Verification Officer',
    position: 'Verification Officer',
  },

  // Super Admins
  {
    id: 'super-admin-2',
    name: 'Super Admin 2',
    title: 'Senior Super Administrator',
    position: 'Super Admin',
  },
  {
    id: 'super-admin-1',
    name: 'Super Admin 1',
    title: 'Super Administrator',
    position: 'Super Admin',
  },

  // Registrar Officers
  {
    id: 'registrar-officer-3',
    name: 'Registrar Officer 3',
    title: 'Senior Registrar Officer',
    position: 'Registrar Officer',
  },
  {
    id: 'registrar-officer-2',
    name: 'Registrar Officer 2',
    title: 'Registrar Officer',
    position: 'Registrar Officer',
  },
  {
    id: 'registrar-officer-1',
    name: 'Registrar Officer 1',
    title: 'Junior Registrar Officer',
    position: 'Registrar Officer',
  },

  // Records Officers
  {
    id: 'records-officer-3',
    name: 'Records Officer 3',
    title: 'Senior Records Officer',
    position: 'Records Officer',
  },
  {
    id: 'records-officer-2',
    name: 'Records Officer 2',
    title: 'Records Officer',
    position: 'Records Officer',
  },
  {
    id: 'records-officer-1',
    name: 'Records Officer 1',
    title: 'Junior Records Officer',
    position: 'Records Officer',
  },

  // Clerks
  {
    id: 'clerk-3',
    name: 'Clerk 3',
    title: 'Senior Clerk',
    position: 'Clerk',
  },
  {
    id: 'clerk-2',
    name: 'Clerk 2',
    title: 'Clerk',
    position: 'Clerk',
  },
  {
    id: 'clerk-1',
    name: 'Clerk 1',
    title: 'Junior Clerk',
    position: 'Clerk',
  },

  // Admins
  {
    id: 'admin-3',
    name: 'Admin 3',
    title: 'Senior Administrator',
    position: 'Admin',
  },
  {
    id: 'admin-2',
    name: 'Admin 2',
    title: 'Administrator',
    position: 'Admin',
  },
].sort((a, b) => a.name.localeCompare(b.name));

export const COMMON_DATES = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'custom', label: 'Select Custom Date' },
];
