// src/hooks/users-action.tsx
'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { hash, compare } from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { UserWithRoleAndProfile } from '@/types/user'
import { changePasswordSchema } from '@/lib/validation/auth/change-password'
import { CertifiedCopyFormData } from '@/lib/validation/forms/certified-copy'
import { getEmailSchema, getPasswordSchema, getNameSchema } from '@/lib/validation/shared'
import { AttachmentType, DocumentStatus, NotificationType, Permission } from '@prisma/client'

/**
 * Sends a notification to a single user.
 */
async function notify(
  userId: string | null,
  title: string,
  message: string,
  tx?: typeof prisma
) {
  const db = tx || prisma
  return db.notification.create({
    data: {
      userId,
      userName: 'System',
      type: NotificationType.SYSTEM,
      title,
      message,
    },
  })
}

/**
 * Finds all users having a specific permission and sends them a notification.
 * The permission parameter is typed as Permission (enum) to match Prisma's expectations.
 */
async function notifyUsersWithPermission(
  permission: Permission,
  title: string,
  message: string,
  tx?: typeof prisma
) {
  const db = tx || prisma
  const users = await db.user.findMany({
    where: {
      roles: {
        some: {
          role: {
            permissions: {
              some: { permission },
            },
          },
        },
      },
    },
    select: { id: true },
  })
  return Promise.all(
    users.map((user) =>
      db.notification.create({
        data: {
          userId: user.id,
          userName: 'System',
          type: NotificationType.SYSTEM,
          title,
          message,
        },
      })
    )
  )
}

// ===================================================
// PASSWORD CHANGE ACTION (notifies only the affected user)
// ===================================================
export async function handleChangePassword(
  userId: string,
  data: z.infer<typeof changePasswordSchema>
) {
  try {
    // Validate input data
    const validatedData = changePasswordSchema.parse(data)

    // Fetch the user's account
    const userAccount = await prisma.account.findFirst({
      where: { userId },
    })

    if (!userAccount || !userAccount.password) {
      return { success: false, message: 'User account not found' }
    }

    // Verify the current password
    const isCurrentPasswordValid = await compare(
      validatedData.currentPassword,
      userAccount.password
    )

    if (!isCurrentPasswordValid) {
      return { success: false, message: 'Current password is incorrect' }
    }

    // Hash the new password
    const hashedNewPassword = await hash(validatedData.newPassword, 10)

    // Update the password in the database
    await prisma.account.update({
      where: { id: userAccount.id },
      data: { password: hashedNewPassword },
    })

    // Notify the affected user
    await notify(userId, 'Password Changed', 'Your password was changed successfully.')

    // Revalidate paths if necessary
    revalidatePath('/profile')

    return { success: true, message: 'Password changed successfully' }
  } catch (error) {
    console.error('Error changing password:', error)
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }
    return { success: false, message: 'Failed to change password' }
  }
}

// ===================================================
// CREATE USER ACTION (notifies affected user and broadcast to those with USER_CREATE permission)
// ===================================================
export async function handleCreateUser(data: FormData) {
  try {
    const roleId = data.get('roleId')
    const email = data.get('email') as string
    const password = data.get('password') as string

    if (!roleId) {
      return { success: false, message: 'Role is required' }
    }

    if (!password) {
      return { success: false, message: 'Password is required' }
    }

    // Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { success: false, message: 'Email already exists' }
    }

    // Find the role first
    const roleData = await prisma.role.findUnique({
      where: { id: roleId as string },
    })

    if (!roleData) {
      return { success: false, message: 'Invalid role selected' }
    }

    const hashedPassword = await hash(password, 10)
    const now = new Date()

    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const createdUser = await tx.user.create({
        data: {
          name: data.get('name') as string,
          email: data.get('email') as string,
          username: data.get('username') as string || null,
          emailVerified: true,
          active: true,
          createdAt: now,
          updatedAt: now,
        },
      })

      // Create role assignment
      await tx.userRole.create({
        data: {
          userId: createdUser.id,
          roleId: roleId as string,
          userName: createdUser.name,
          roleName: roleData.name
        },
      })

      // Create account
      await tx.account.create({
        data: {
          userId: createdUser.id,
          providerId: 'credentials',
          accountId: data.get('email') as string,
          password: hashedPassword,
          createdAt: now,
          updatedAt: now,
        },
      })

      // Create profile with all fields
      await tx.profile.create({
        data: {
          userId: createdUser.id,
          dateOfBirth: data.get('dateOfBirth') ? new Date(data.get('dateOfBirth') as string) : null,
          phoneNumber: data.get('phoneNumber') as string || null,
          address: data.get('address') as string || null,
          city: data.get('city') as string || null,
          state: data.get('state') as string || null,
          country: data.get('country') as string || null,
          postalCode: data.get('postalCode') as string || null,
          bio: data.get('bio') as string || null,
          occupation: data.get('occupation') as string || null,
          gender: data.get('gender') as string || null,
          nationality: data.get('nationality') as string || null,
        },
      })

      // Return user with roles and profile included
      return await tx.user.findUnique({
        where: { id: createdUser.id },
        include: {
          roles: {
            include: {
              role: {
                include: {
                  permissions: true,
                },
              },
            },
          },
          profile: true,
        },
      })
    })

    revalidatePath('/manage-users')
    return {
      success: true,
      message: 'User created successfully',
      data: result,
    }
  } catch (error) {
    console.error('Create user error:', error)
    return { success: false, message: error instanceof Error ? error.message : 'Failed to create user' }
  }
}

// ===================================================
// GET USER ACTION (no notifications for read-only actions)
// ===================================================
export async function handleGetUser(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          select: {
            phoneNumber: true,
            address: true,
            city: true,
            state: true,
            country: true,
          },
        },
      },
    })

    if (!user) {
      return { success: false, message: 'User not found' }
    }

    return { success: true, user }
  } catch (error) {
    console.error('Get user error:', error)
    return { success: false, message: 'Failed to fetch user' }
  }
}

// ===================================================
// DELETE USER ACTION (broadcast notification to those with USER_DELETE permission)
// ===================================================
export async function deleteUser(userId: string) {
  try {
    const existingUser = await prisma.user.findUnique({ where: { id: userId } })
    if (!existingUser) {
      return { success: false, message: 'User not found' }
    }

    // Delete the user in a transaction
    await prisma.$transaction(async (tx) => {
      await tx.user.delete({ where: { id: userId } })
    })

    // Notify all users with the USER_DELETE permission
    await notifyUsersWithPermission(
      Permission.USER_DELETE,
      'User Deleted',
      `User "${existingUser.email}" was deleted.`
    )

    return { success: true, message: 'User deleted, notifications sent.' }
  } catch (error) {
    console.error('Delete user error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete user',
    }
  }
}

// ===================================================
// ACTIVATE USER ACTION (notifies only the affected user)
// ===================================================
export async function activateUser(userId: string) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true, updatedAt: new Date() },
    })

    await notify(userId, 'Account Activated', 'Your account has been activated successfully.')

    return {
      success: true,
      message: 'User activated successfully',
      data: user,
    }
  } catch (error) {
    console.error('Error activating user:', error)
    return { success: false, message: 'Failed to activate user' }
  }
}

// ===================================================
// DEACTIVATE USER ACTION (notifies only the affected user)
// ===================================================
export async function deactivateUser(userId: string) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: false, updatedAt: new Date() },
    })

    await notify(userId, 'Account Deactivated', 'Your account has been deactivated.')

    return {
      success: true,
      message: 'User deactivated successfully',
      data: user,
    }
  } catch (error) {
    console.error('Error deactivating user:', error)
    return { success: false, message: 'Failed to deactivate user' }
  }
}

// ===================================================
// CREATE CERTIFIED COPY ACTION (notifies only the affected user)
// ===================================================
export async function createCertifiedCopy(
  data: CertifiedCopyFormData,
  userId: string
) {
  try {
    // Use a transaction to ensure all or nothing
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Document first
      const document = await tx.document.create({
        data: {
          type: AttachmentType.BIRTH_CERTIFICATE,
          title: `Certified Copy - ${data.lcrNo}`,
          status: DocumentStatus.PENDING,
          version: 1,
          isLatest: true,
        },
      })

      // 2. Create Attachment
      const attachment = await tx.attachment.create({
        data: {
          userId: userId,
          documentId: document.id,
          type: AttachmentType.BIRTH_CERTIFICATE,
          fileUrl: '', // placeholder
          fileName: `certified-copy-${data.lcrNo}`,
          fileSize: 0, // placeholder
          mimeType: 'application/pdf', // placeholder
          status: DocumentStatus.PENDING,
        },
      })

      // 3. Create CertifiedCopy
      const certifiedCopy = await tx.certifiedCopy.create({
        data: {
          lcrNo: data.lcrNo,
          bookNo: data.bookNo,
          pageNo: data.pageNo,
          searchedBy: data.searchedBy,
          contactNo: data.contactNo,
          date: data.date ? new Date(data.date) : null,
          attachmentId: attachment.id,
          requesterName: data.requesterName,
          relationshipToOwner: data.relationshipToOwner,
          address: data.address,
          purpose: data.purpose,
          formId: data.formId,
        },
      })

      // Notify the affected user within the transaction
      await notify(
        userId,
        'Certified Copy Request',
        'Your certified copy request has been submitted successfully.',
      )

      return { certifiedCopy, attachment, document }
    })

    revalidatePath('/users')
    return {
      success: true,
      message: 'Certified copy created successfully',
      data: result,
    }
  } catch (error) {
    console.error('Error creating certified copy:', error)
    return { success: false, message: 'Failed to create certified copy' }
  }
}

// ===================================================
// ENABLE USER ACTION (notifies only the affected user)
// ===================================================
export async function enableUser(userId: string) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true, updatedAt: new Date() },
    })

    await notify(userId, 'Account Enabled', 'Your account has been enabled successfully.')

    return {
      success: true,
      message: 'User enabled successfully',
      data: user,
    }
  } catch (error) {
    console.error('Error enabling user:', error)
    return { success: false, message: 'Failed to enable user' }
  }
}

// ===================================================
// UPDATE USER ROLE ACTION (notifies affected user and broadcast to those with ROLE_ASSIGN permission)
// ===================================================
export async function updateUserRole(userId: string, roleId: string) {
  try {
    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid user ID provided')
    }
    if (!roleId || typeof roleId !== 'string') {
      throw new Error('Invalid role ID provided')
    }

    // Validate if the role exists
    const role = await prisma.role.findUnique({
      where: { id: roleId },
    })
    if (!role) {
      throw new Error('Role not found')
    }

    // Validate if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    if (!user) {
      throw new Error('User not found')
    }

    // Perform role update inside a transaction
    await prisma.$transaction(async (tx) => {
      // Remove any existing role assignments
      await tx.userRole.deleteMany({
        where: { userId },
      })

      // Assign the new role
      await tx.userRole.create({
        data: {
          userId,
          roleId,
        },
      })
    })

    // Fetch updated user data with roles and profile included
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  select: { permission: true },
                },
              },
            },
          },
        },
      },
    })

    if (!updatedUser) {
      throw new Error('Updated user not found')
    }

    // Notify the affected user about the role update
    await notify(userId, 'Role Updated', 'Your user role has been updated successfully.')

    // Broadcast notification to all users with the ROLE_ASSIGN permission
    await notifyUsersWithPermission(
      Permission.ROLE_ASSIGN,
      'User Role Updated',
      `User "${updatedUser.email}" role has been updated.`
    )

    return {
      success: true,
      message: 'User role updated successfully',
      data: updatedUser as UserWithRoleAndProfile,
    }
  } catch (error) {
    console.error('Error updating user role:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update role',
    }
  }
}
