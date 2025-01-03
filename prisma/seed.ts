// prisma\seed.ts
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    const genPassword = await hash('test', 12)
    const user = await prisma.user.upsert({
        where: { email: 'test@test.com' },
        update: {},
        create: {
            email: 'test@test.com',
            name: 'Test User',
            emailVerified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            accounts: {
                create: {
                    accountId: 'local',
                    providerId: 'credentials',
                    password: genPassword,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            }
        }
    })
    console.log({ user })
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })