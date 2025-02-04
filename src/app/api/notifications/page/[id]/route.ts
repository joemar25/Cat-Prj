import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params; // Await to properly handle params

  const { status } = await request.json(); // Expecting `status` to be an array of `NotificationStatus`

  try {
    const notification = await prisma.notification.update({
      where: { id },
      data: { status: { set: status } }, // Use `set` to replace the current `status` array with the new one
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
