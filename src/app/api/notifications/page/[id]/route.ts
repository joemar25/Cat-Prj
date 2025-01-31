// src/app/api/notifications/[id]/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params; // Await `params` before using

  const { status } = await request.json(); // Now we expect `status` instead of `read`

  try {
    const notification = await prisma.notification.update({
      where: { id },
      data: { status }, // Update the `status` instead of `read`
    });
    return NextResponse.json(notification);
  } catch (error) {
    console.error('Failed to update notification status:', error);
    return NextResponse.json(
      { error: 'Failed to update notification status' },
      { status: 500 }
    );
  }
}
