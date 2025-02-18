// prisma/seed.ts
import { hash } from 'bcryptjs'
import { generateTestData } from './seed-data'
import { Permission, PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

// Define a type alias for users that include their roles.
type UserWithRole = Prisma.UserGetPayload<{
  include: { roles: { include: { role: true } } }
}>

async function main() {
  console.log('Starting database seeding...')

  // ----------------------------
  // Seed Roles & Permissions
  // ----------------------------
  // Base roles always created (production & development)
  const roleConfigs = [
    {
      name: 'Super Admin',
      description: 'Has complete system access',
      permissions: [
        Permission.USER_CREATE,
        Permission.USER_READ,
        Permission.USER_UPDATE,
        Permission.USER_DELETE,
        Permission.USER_ACTIVATE,
        Permission.USER_DEACTIVATE,
        Permission.USER_EXPORT,
        Permission.ROLE_CREATE,
        Permission.ROLE_READ,
        Permission.ROLE_UPDATE,
        Permission.ROLE_DELETE,
        Permission.ROLE_ASSIGN,
        Permission.DOCUMENT_CREATE,
        Permission.DOCUMENT_READ,
        Permission.DOCUMENT_UPDATE,
        Permission.DOCUMENT_DELETE,
        Permission.DOCUMENT_VERIFY,
        Permission.DOCUMENT_EXPORT,
        Permission.REPORT_CREATE,
        Permission.REPORT_READ,
        Permission.REPORT_EXPORT,
        Permission.ROLE_EXPORT,
        Permission.AUDIT_LOG_READ,
        Permission.FEEDBACK_READ,
        Permission.FEEDBACK_DELETE,
        Permission.FEEDBACK_EXPORT,
      ],
    },
    {
      name: 'Admin',
      description: 'Has high-level administrative privileges',
      permissions: [
        Permission.USER_CREATE,
        Permission.USER_READ,
        Permission.USER_UPDATE,
        Permission.USER_ACTIVATE,
        Permission.USER_DEACTIVATE,
        Permission.DOCUMENT_CREATE,
        Permission.DOCUMENT_READ,
        Permission.DOCUMENT_UPDATE,
        Permission.DOCUMENT_VERIFY,
        Permission.DOCUMENT_EXPORT,
        Permission.REPORT_READ,
        Permission.REPORT_EXPORT,
        Permission.AUDIT_LOG_READ,
        Permission.FEEDBACK_READ,
        Permission.FEEDBACK_DELETE,
        Permission.FEEDBACK_EXPORT,
      ],
    },
  ]

  // In non-production environments, add additional roles.
  if (process.env.NEXT_PUBLIC_NODE_ENV !== 'production') {
    roleConfigs.push(
      {
        name: 'Registrar Officer',
        description: 'Handles document registration and verification',
        permissions: [
          Permission.DOCUMENT_CREATE,
          Permission.DOCUMENT_READ,
          Permission.DOCUMENT_UPDATE,
          Permission.DOCUMENT_VERIFY,
          Permission.DOCUMENT_EXPORT,
          Permission.REPORT_READ,
        ],
      },
      {
        name: 'Records Officer',
        description: 'Manages document archiving and retrieval',
        permissions: [
          Permission.DOCUMENT_READ,
          Permission.DOCUMENT_UPDATE,
          Permission.REPORT_READ,
        ],
      },
      {
        name: 'Verification Officer',
        description: 'Handles document verification and authentication',
        permissions: [Permission.DOCUMENT_VERIFY, Permission.REPORT_READ],
      },
      {
        name: 'Clerk',
        description: 'Performs data entry and administrative support',
        permissions: [Permission.DOCUMENT_READ, Permission.REPORT_READ],
      }
    )
  }

  // Upsert each role with its permissions.
  for (const config of roleConfigs) {
    await prisma.role.upsert({
      where: { name: config.name },
      update: { description: config.description },
      create: {
        name: config.name,
        description: config.description,
        permissions: {
          create: config.permissions.map((permission) => ({
            permission,
            roleName: config.name,
          })),
        },
      },
    })
  }

  const roles = await prisma.role.findMany()
  const roleMap = Object.fromEntries(roles.map((role) => [role.name, role.id]))
  if (!roleMap['Super Admin'] || !roleMap['Admin']) {
    throw new Error('Required roles not found')
  }

  // ----------------------------
  // Create / Reuse Users
  // ----------------------------
  const defaultPassword = await hash('password', 12)
  const userIds: string[] = []

  // Check for existing users (for example, users whose email ends with '@gov.ph')
  const existingUsers = await prisma.user.findMany({
    where: { email: { endsWith: '@gov.ph' } },
    include: { roles: { include: { role: true } } },
  })

  if (existingUsers.length > 0) {
    console.log(`Found ${existingUsers.length} existing users. Reusing them...`)
    existingUsers.forEach((user) => userIds.push(user.id))
  } else {
    // Helper function to create users for a given role.
    const createUsers = async (
      count: number,
      roleName: string,
      emailPrefix: string,
      domain: string
    ): Promise<UserWithRole[]> => {
      return Promise.all(
        Array(count)
          .fill(null)
          .map(async (_, index) => {
            const email = `${emailPrefix}${index + 1}@${domain}`
            const user = await prisma.user.upsert({
              where: { email },
              update: {},
              create: {
                email,
                name: `${roleName} ${index + 1}`,
                emailVerified: true,
                active: true,
                // Non-null assertion is safe here because we throw if required roles are missing.
                roles: { create: { roleId: roleMap[roleName]! } },
                username: `${emailPrefix}${index + 1}`,
                accounts: {
                  create: {
                    accountId: `local-${emailPrefix}-${index + 1}`,
                    providerId: 'credentials',
                    password: defaultPassword,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                },
              },
              include: { roles: { include: { role: true } } },
            })
            userIds.push(user.id)
            return user
          })
      )
    }

    // Create users for the core roles.
    const superAdmins = await createUsers(1, 'Super Admin', 'superadmin', 'gov.ph')
    const admins = await createUsers(2, 'Admin', 'admin', 'gov.ph')

    // Declare arrays for additional roles with explicit types.
    let registrars: UserWithRole[] = []
    let recordsOfficers: UserWithRole[] = []
    let verificationOfficers: UserWithRole[] = []
    let clerks: UserWithRole[] = []

    if (process.env.NEXT_PUBLIC_NODE_ENV !== 'production') {
      registrars = await createUsers(3, 'Registrar Officer', 'registrar', 'gov.ph')
      recordsOfficers = await createUsers(3, 'Records Officer', 'records', 'gov.ph')
      verificationOfficers = await createUsers(3, 'Verification Officer', 'verification', 'gov.ph')
      clerks = await createUsers(3, 'Clerk', 'clerk', 'gov.ph')
    }

    // Combine all newly created users for logging.
    const allUsers: UserWithRole[] = [
      ...superAdmins,
      ...admins,
      ...registrars,
      ...recordsOfficers,
      ...verificationOfficers,
      ...clerks,
    ]

    console.log('Created new users:')
    allUsers.forEach((user) => {
      console.log(
        `- ${user.roles[0]?.role?.name ?? 'No Role'}: ${user.email} / password`
      )
    })
  }

  // ----------------------------
  // Create Profiles for Users
  // ----------------------------
  const profiles = (
    await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, roles: { include: { role: true } } },
    })
  ).map((user) => ({
    userId: user.id,
    dateOfBirth: new Date('1990-01-01'),
    phoneNumber: '+639123456789',
    address: 'Legazpi City',
    city: 'Legazpi City',
    state: 'Legazpi City',
    country: 'Philippines',
    postalCode: '1000',
    occupation: user.roles[0]?.role?.name ?? '',
    gender: 'male',
    nationality: 'Filipino',
  }))

  await prisma.profile.createMany({ data: profiles, skipDuplicates: true })

  // ----------------------------
  // Generate Additional Test Data
  // ----------------------------
  if (process.env.NEXT_PUBLIC_NODE_ENV !== 'production') {
    await generateTestData(prisma, userIds)
  } else {
    console.log('Production environment detected. Skipping test data generation.')
  }

  console.log('Seeding completed successfully!')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('Error during seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
