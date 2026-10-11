import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/auth';
import { updateEventSchema } from '@/lib/validations/event';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { id: eventId } = await params;

    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const json = await request.json();
    const result = updateEventSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updateData = { ...result.data };

    // Format date properly if present
    if (updateData.date) {
      (updateData as any).date = new Date(updateData.date);
    }

    // Verify category exists if categoryId is updated
    if (updateData.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: updateData.categoryId },
      });
      if (!category) {
        return NextResponse.json({ error: 'Invalid category specified' }, { status: 400 });
      }
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: updateData as any,
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      message: 'Event updated successfully',
      data: updatedEvent,
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Internal server error while updating event' },
      { status: 500 }
    );
  }
}
