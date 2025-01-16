import { ROLE_PERMISSIONS } from '@/types/auth';
import { PrismaClient, UserRole } from '@prisma/client';
import { hash } from 'bcrypt';
import { generateTestData } from './seed-data';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');
  const defaultPassword = await hash('password', 12);
  const userIds: string[] = [];

  // Create admin users
  const adminUsers = await Promise.all(
    Array(3).fill(null).map(async (_, index) => {
      const adminUser = await prisma.user.upsert({
        where: { email: `admin${index + 1}@cris.gov.ph` },
        update: {},
        create: {
          email: `admin${index + 1}@cris.gov.ph`,
          name: `Admin User ${index + 1}`,
          emailVerified: true,
          role: UserRole.ADMIN,
          permissions: ROLE_PERMISSIONS[UserRole.ADMIN],
          createdAt: new Date(),
          updatedAt: new Date(),
          accounts: {
            create: {
              accountId: `local-admin-${index + 1}`,
              providerId: 'credentials',
              password: defaultPassword,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        },
      });
      userIds.push(adminUser.id);
      return adminUser;
    })
  );

  // Create staff users
  const staffUsers = await Promise.all(
    Array(5).fill(null).map(async (_, index) => {
      const staffUser = await prisma.user.upsert({
        where: { email: `staff${index + 1}@cris.gov.ph` },
        update: {},
        create: {
          email: `staff${index + 1}@cris.gov.ph`,
          name: `Staff User ${index + 1}`,
          emailVerified: true,
          role: UserRole.STAFF,
          permissions: ROLE_PERMISSIONS[UserRole.STAFF],
          createdAt: new Date(),
          updatedAt: new Date(),
          accounts: {
            create: {
              accountId: `local-staff-${index + 1}`,
              providerId: 'credentials',
              password: defaultPassword,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        },
      });
      userIds.push(staffUser.id);
      return staffUser;
    })
  );

  // Create user profiles for all users
  await Promise.all(
    [...adminUsers, ...staffUsers].map(async (user) => {
      await prisma.profile.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          dateOfBirth: new Date('1990-01-01'),
          phoneNumber: '+639123456789',
          address: 'Manila City Hall',
          city: 'Manila',
          state: 'Metro Manila',
          country: 'Philippines',
          postalCode: '1000',
          occupation: user.role === UserRole.ADMIN ? 'System Administrator' : 'Civil Registry Staff',
          gender: 'Other',
          nationality: 'Filipino',
        },
      });
    })
  );

  // Generate test data using our new generator
  await generateTestData(prisma, userIds);

  console.log(`Seeding completed successfully!`);
  console.log(`Test accounts created:`);
  adminUsers.forEach((user, index) => {
    console.log(`- Admin ${index + 1}: ${user.email} / password`);
  });
  staffUsers.forEach((user, index) => {
    console.log(`- Staff ${index + 1}: ${user.email} / password`);
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('Error during seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });