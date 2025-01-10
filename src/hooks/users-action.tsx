// src/hooks/users-action.tsx
'use server';

import { prisma } from '@/lib/prisma';
import {
  CertifiedCopyFormData,
  getEmailSchema,
  getNameSchema,
  getPasswordSchema,
} from '@/lib/zod';
import { ROLE_PERMISSIONS } from '@/types/auth';
import {
  AttachmentType,
  DocumentStatus,
  Profile,
  User,
  UserRole,
} from '@prisma/client';
import { hash } from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Schema for creating a user in the admin panel
const createUserSchema = z.object({
  email: getEmailSchema(),
  password: getPasswordSchema('password'),
  name: getNameSchema(),
  role: z.enum(['ADMIN', 'STAFF', 'USER']).default('USER'),
});

export async function handleCreateUser(data: FormData) {
  try {
    const parsedData = createUserSchema.parse({
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
      role: data.get('role'),
    });

    const existingUser = await prisma.user.findUnique({
      where: { email: parsedData.email },
    });

    if (existingUser) {
      return { success: false, message: 'Email already exists' };
    }

    const hashedPassword = await hash(parsedData.password, 10);
    const now = new Date();

    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const createdUser = await tx.user.create({
        data: {
          name: parsedData.name,
          email: parsedData.email,
          emailVerified: false,
          role: parsedData.role as UserRole,
          permissions: ROLE_PERMISSIONS[parsedData.role as UserRole],
          createdAt: now,
          updatedAt: now,
        },
      });

      // Create account
      await tx.account.create({
        data: {
          userId: createdUser.id,
          providerId: 'credentials',
          accountId: parsedData.email,
          password: hashedPassword,
          createdAt: now,
          updatedAt: now,
        },
      });

      // Create empty profile
      await tx.profile.create({
        data: {
          userId: createdUser.id,
          phoneNumber: '',
          address: '',
          city: '',
          state: '',
          country: '',
        },
      });

      return createdUser;
    });

    revalidatePath('/manage-users');
    return {
      success: true,
      message: 'User created successfully',
      user: result,
    };
  } catch (error) {
    console.error('Create user error:', error);
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message };
    }
    return { success: false, message: 'Failed to create user' };
  }
}

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
    });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    return { success: true, user };
  } catch (error) {
    console.error('Get user error:', error);
    return { success: false, message: 'Failed to fetch user' };
  }
}

export async function deleteUser(userId: string) {
  try {
    // Create an audit log entry before deletion
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'DELETE_USER',
        entityType: 'USER',
        entityId: userId,
        details: { reason: 'User deleted through admin interface' },
      },
    });

    // Delete the user - Prisma will handle cascading deletes based on schema
    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath('/users');
    return { success: true, message: 'User deleted successfully' };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, message: 'Failed to delete user', error };
  }
}

export async function handleUpdateUser(userId: string, data: Partial<User>) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    revalidatePath('/users');
    return { success: true, message: 'User updated successfully', data: user };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, message: 'Failed to update user', error };
  }
}

export async function handleUpdateUserProfile(
  userId: string,
  data: Partial<Profile>
) {
  try {
    const profile = await prisma.profile.upsert({
      where: { userId },
      update: {
        ...data,
        updatedAt: new Date(),
      },
      create: {
        userId,
        ...data,
      },
    });

    revalidatePath('/users');
    return {
      success: true,
      message: 'User profile updated successfully',
      data: profile,
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, message: 'Failed to update user profile', error };
  }
}

export async function activateUser(userId: string) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true, updatedAt: new Date() },
    });
    return {
      success: true,
      message: 'User activated successfully',
      data: user,
    };
  } catch (error) {
    console.error('Error activating user:', error);
    return { success: false, message: 'Failed to activate user' };
  }
}

export async function deactivateUser(userId: string) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: false, updatedAt: new Date() },
    });
    return {
      success: true,
      message: 'User deactivated successfully',
      data: user,
    };
  } catch (error) {
    console.error('Error deactivating user:', error);
    return { success: false, message: 'Failed to deactivate user' };
  }
}
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
          type: AttachmentType.BIRTH_CERTIFICATE, // or appropriate type
          title: `Certified Copy - ${data.lcrNo}`,
          status: DocumentStatus.PENDING,
          version: 1,
          isLatest: true,
        },
      });

      // 2. Create Attachment
      const attachment = await tx.attachment.create({
        data: {
          userId: userId,
          documentId: document.id,
          type: AttachmentType.BIRTH_CERTIFICATE, // or appropriate type
          fileUrl: '', // placeholder
          fileName: `certified-copy-${data.lcrNo}`,
          fileSize: 0, // placeholder
          mimeType: 'application/pdf', // placeholder
          status: DocumentStatus.PENDING,
        },
      });

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
          requesterName: data.requesterName, // Include required fields
          relationshipToOwner: data.relationshipToOwner,
          address: data.address,
          purpose: data.purpose,
        },
      });

      return { certifiedCopy, attachment, document };
    });

    revalidatePath('/users');
    return {
      success: true,
      message: 'Certified copy created successfully',
      data: result,
    };
  } catch (error) {
    console.error('Error creating certified copy:', error);
    return { success: false, message: 'Failed to create certified copy' };
  }
}
