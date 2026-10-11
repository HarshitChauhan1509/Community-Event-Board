import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const { id: eventId } = await params;

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Avoid duplicate reminders via upsert
    const reminder = await prisma.reminder.upsert({
      where: {
        userId_eventId: {
          userId: sessionUser.id,
          eventId,
        },
      },
      update: {},
      create: {
        userId: sessionUser.id,
        eventId,
      },
    });

    return NextResponse.json(
      {
        message: 'Reminder saved successfully',
        reminderId: reminder.id,
        hasReminder: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating reminder:', error);
    return NextResponse.json(
      { error: 'Failed to save reminder' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const { id: eventId } = await params;

    await prisma.reminder.deleteMany({
      where: {
        userId: sessionUser.id,
        eventId,
      },
    });

    return NextResponse.json({
      message: 'Reminder removed successfully',
      hasReminder: false,
    });
  } catch (error) {
    console.error('Error removing reminder:', error);
    return NextResponse.json(
      { error: 'Failed to remove reminder' },
      { status: 500 }
    );
  }
}
