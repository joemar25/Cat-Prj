import { hash } from 'bcrypt'
import { generateTestData } from './seed-data'
import { Permission, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')

  const roleConfigs = [
    {
      name: 'Super Admin',
      description: 'Has complete system access',
      permissions: [
        'USER_CREATE', 'USER_READ', 'USER_UPDATE', 'USER_DELETE',
        'ROLE_CREATE', 'ROLE_READ', 'ROLE_UPDATE', 'ROLE_DELETE',
        'DOCUMENT_CREATE', 'DOCUMENT_READ', 'DOCUMENT_UPDATE', 'DOCUMENT_DELETE', 'DOCUMENT_VERIFY',
        'REPORT_CREATE', 'REPORT_READ', 'REPORT_EXPORT',
        'AUDIT_LOG_READ', 'FEEDBACK_READ', 'FEEDBACK_DELETE', 'FEEDBACK_EXPORT'
      ] as Permission[]
    },
    {
      name: 'Admin',
      description: 'Has high-level administrative privileges',
      permissions: [
        'USER_CREATE', 'USER_READ', 'USER_UPDATE',
        'DOCUMENT_CREATE', 'DOCUMENT_READ', 'DOCUMENT_UPDATE', 'DOCUMENT_VERIFY',
        'REPORT_READ', 'REPORT_EXPORT',
        'AUDIT_LOG_READ', 'FEEDBACK_READ', 'FEEDBACK_DELETE', 'FEEDBACK_EXPORT'
      ] as Permission[]
    },
    {
      name: 'Registrar Officer',
      description: 'Handles document registration and verification',
      permissions: [
        'DOCUMENT_CREATE', 'DOCUMENT_READ', 'DOCUMENT_UPDATE', 'DOCUMENT_VERIFY',
        'REPORT_READ'
      ] as Permission[]
    },
    {
      name: 'Records Officer',
      description: 'Manages document archiving and retrieval',
      permissions: [
        'DOCUMENT_READ', 'DOCUMENT_UPDATE',
        'REPORT_READ'
      ] as Permission[]
    },
    {
      name: 'Verification Officer',
      description: 'Handles document verification and authentication',
      permissions: [
        'DOCUMENT_VERIFY',
        'REPORT_READ'
      ] as Permission[]
    },
    {
      name: 'Clerk',
      description: 'Performs data entry and administrative support',
      permissions: [
        'DOCUMENT_READ',
        'REPORT_READ'
      ] as Permission[]
    }
  ]

  for (const config of roleConfigs) {
    await prisma.role.upsert({
      where: { name: config.name },
      update: { description: config.description },
      create: {
        name: config.name,
        description: config.description,
        permissions: { create: config.permissions.map(permission => ({ permission })) }
      }
    })
  }

  const roles = await prisma.role.findMany()
  const roleMap = Object.fromEntries(roles.map(role => [role.name, role.id]))

  if (!roleMap['Super Admin'] || !roleMap['Admin']) {
    throw new Error('Required roles not found')
  }

  const defaultPassword = await hash('password', 12)
  const userIds: string[] = []

  const createUsers = async (count: number, roleName: string, emailPrefix: string, domain: string) => {
    return Promise.all(
      Array(count).fill(null).map(async (_, index) => {
        const email = `${emailPrefix}${index + 1}@${domain}`
        const user = await prisma.user.upsert({
          where: { email },
          update: {},
          create: {
            email,
            name: `${roleName} ${index + 1}`,
            emailVerified: true,
            active: true,
            roles: { create: { roleId: roleMap[roleName] } },
            accounts: {
              create: {
                accountId: `local-${emailPrefix}-${index + 1}`,
                providerId: 'credentials',
                password: defaultPassword,
                createdAt: new Date(),
                updatedAt: new Date()
              }
            }
          },
          include: { roles: { include: { role: true } } }
        })
        userIds.push(user.id)
        return user
      })
    )
  }

  const superAdmins = await createUsers(2, 'Super Admin', 'superadmin', 'gov.ph')
  const admins = await createUsers(3, 'Admin', 'admin', 'gov.ph')
  const registrars = await createUsers(3, 'Registrar Officer', 'registrar', 'gov.ph')
  const recordsOfficers = await createUsers(3, 'Records Officer', 'records', 'gov.ph')
  const verificationOfficers = await createUsers(3, 'Verification Officer', 'verification', 'gov.ph')
  const clerks = await createUsers(3, 'Clerk', 'clerk', 'gov.ph')

  const profiles = [...superAdmins, ...admins, ...registrars, ...recordsOfficers, ...verificationOfficers, ...clerks].map(user => ({
    userId: user.id,
    dateOfBirth: new Date('1990-01-01'),
    phoneNumber: '+639123456789',
    address: 'Manila City Hall',
    city: 'Manila',
    state: 'Metro Manila',
    country: 'Philippines',
    postalCode: '1000',
    occupation: user.roles[0]?.role.name,
    gender: 'Other',
    nationality: 'Filipino'
  }))

  await prisma.profile.createMany({ data: profiles })

  await generateTestData(prisma, userIds)

  console.log(`Seeding completed successfully!`)
    ;[...superAdmins, ...admins, ...registrars, ...recordsOfficers, ...verificationOfficers, ...clerks].forEach(user => {
      console.log(`- ${user.roles[0]?.role.name}: ${user.email} / password`)
    })
}

main()
  .then(() => prisma.$disconnect())
  .catch(async e => {
    console.error('Error during seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
