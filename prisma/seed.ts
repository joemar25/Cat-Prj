// prisma/seed.ts
import { ROLE_PERMISSIONS } from '@/types/auth';
import { PrismaClient, UserRole } from '@prisma/client';
import { hash } from 'bcrypt';
import { generateTestData } from './seed-data';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');
  const defaultPassword = await hash('password', 12);
  const userIds: string[] = [];

  // Create users with different roles
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@cris.gov.ph' },
    update: {},
    create: {
      email: 'admin@cris.gov.ph',
      name: 'Admin User',
      emailVerified: true,
      role: UserRole.ADMIN,
      permissions: ROLE_PERMISSIONS[UserRole.ADMIN],
      createdAt: new Date(),
      updatedAt: new Date(),
      accounts: {
        create: {
          accountId: 'local-admin',
          providerId: 'credentials',
          password: defaultPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
  });
  userIds.push(adminUser.id);

  const staffUser = await prisma.user.upsert({
    where: { email: 'staff@cris.gov.ph' },
    update: {},
    create: {
      email: 'staff@cris.gov.ph',
      name: 'Staff User',
      emailVerified: true,
      role: UserRole.STAFF,
      permissions: ROLE_PERMISSIONS[UserRole.STAFF],
      createdAt: new Date(),
      updatedAt: new Date(),
      accounts: {
        create: {
          accountId: 'local-staff',
          providerId: 'credentials',
          password: defaultPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
  });
  userIds.push(staffUser.id);

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@gmail.com' },
    update: {},
    create: {
      email: 'user@gmail.com',
      name: 'Regular User',
      emailVerified: true,
      role: UserRole.USER,
      permissions: ROLE_PERMISSIONS[UserRole.USER],
      createdAt: new Date(),
      updatedAt: new Date(),
      accounts: {
        create: {
          accountId: 'local-user',
          providerId: 'credentials',
          password: defaultPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
  });
  userIds.push(regularUser.id);

  // Create user profiles using upsert
  await prisma.profile.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      dateOfBirth: new Date('1990-01-01'),
      phoneNumber: '+639123456789',
      address: 'Manila City Hall',
      city: 'Manila',
      state: 'Metro Manila',
      country: 'Philippines',
      postalCode: '1000',
      occupation: 'System Administrator',
      gender: 'Other',
      nationality: 'Filipino',
    },
  });

  await prisma.profile.upsert({
    where: { userId: staffUser.id },
    update: {},
    create: {
      userId: staffUser.id,
      dateOfBirth: new Date('1995-05-05'),
      phoneNumber: '+639187654321',
      address: 'Manila City Hall',
      city: 'Manila',
      state: 'Metro Manila',
      country: 'Philippines',
      postalCode: '1000',
      occupation: 'Civil Registry Staff',
      gender: 'Other',
      nationality: 'Filipino',
    },
  });

  await prisma.profile.upsert({
    where: { userId: regularUser.id },
    update: {},
    create: {
      userId: regularUser.id,
      dateOfBirth: new Date('1998-12-25'),
      phoneNumber: '+639199999999',
      address: '123 Sample St.',
      city: 'Manila',
      state: 'Metro Manila',
      country: 'Philippines',
      postalCode: '1000',
      occupation: 'Student',
      gender: 'Other',
      nationality: 'Filipino',
    },
  });

  // Generate test data using our new generator
  await generateTestData(prisma, userIds);

  console.log(`Seeding completed successfully!`);
  console.log(`Test accounts created:`);
  console.log(`- Admin: admin@cris.gov.ph / password`);
  console.log(`- Staff: staff@cris.gov.ph / password`);
  console.log(`- User: user@gmail.com / password`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('Error during seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
