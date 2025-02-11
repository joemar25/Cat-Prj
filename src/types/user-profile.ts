import { Profile, User } from '@prisma/client'

export type ProfileWithUser = Profile & {
    user: User | null
}