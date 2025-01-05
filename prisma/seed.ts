// prisma/seed.ts
import { PrismaClient, UserRole, Permission } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    const defaultPassword = await hash('password', 12)

    // Create users with different roles
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@cris.gov.ph' },
        update: {},
        create: {
            email: 'admin@cris.gov.ph',
            name: 'Admin User',
            emailVerified: true,
            role: UserRole.ADMIN,
            permissions: [
                Permission.QUEUE_VIEW,
                Permission.QUEUE_PROCESS,
                Permission.QUEUE_DELETE,
                Permission.QUEUE_UPDATE,
                Permission.QUEUE_ADD_NOTES,
                Permission.USERS_MANAGE,
                Permission.DOCUMENTS_MANAGE,
                Permission.WORKFLOW_MANAGE,
                Permission.REPORTS_VIEW,
                Permission.SYSTEM_SETTINGS
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
            accounts: {
                create: {
                    accountId: 'local-admin',
                    providerId: 'credentials',
                    password: defaultPassword,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            }
        }
    })

    const staffUser = await prisma.user.upsert({
        where: { email: 'staff@cris.gov.ph' },
        update: {},
        create: {
            email: 'staff@cris.gov.ph',
            name: 'Staff User',
            emailVerified: true,
            role: UserRole.STAFF,
            permissions: [
                Permission.QUEUE_VIEW,
                Permission.QUEUE_PROCESS,
                Permission.QUEUE_UPDATE,
                Permission.QUEUE_ADD_NOTES,
                Permission.DOCUMENTS_MANAGE,
                Permission.REPORTS_VIEW
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
            accounts: {
                create: {
                    accountId: 'local-staff',
                    providerId: 'credentials',
                    password: defaultPassword,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            }
        }
    })

    const regularUser = await prisma.user.upsert({
        where: { email: 'user@gmail.com' },
        update: {},
        create: {
            email: 'user@gmail.com',
            name: 'Regular User',
            emailVerified: true,
            role: UserRole.USER,
            permissions: [Permission.QUEUE_VIEW],
            createdAt: new Date(),
            updatedAt: new Date(),
            accounts: {
                create: {
                    accountId: 'local-user',
                    providerId: 'credentials',
                    password: defaultPassword,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            }
        }
    })

    // Create user profiles
    await prisma.profile.createMany({
        data: [
            {
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
                nationality: 'Filipino'
            },
            {
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
                nationality: 'Filipino'
            },
            {
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
                nationality: 'Filipino'
            }
        ]
    })

    console.log(`Seeding completed successfully!`)
    console.log(`Test accounts created:`)
    console.log(`- Admin: admin@cris.gov.ph / password`)
    console.log(`- Staff: staff@cris.gov.ph / password`)
    console.log(`- User: user@gmail.com / password`)
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error('Error during seeding:', e)
        await prisma.$disconnect()
        process.exit(1)
    })

// commands:
// rm -rf prisma/migrations
// npx prisma migrate dev--name init
// npx prisma db push
// npx prisma db pull
// npx prisma migrate reset