import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reminders = await prisma.reminder.findMany({
      where: {
        userId: sessionUser.id,
      },
      include: {
        event: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
            _count: {
              select: {
                reminders: true,
              },
            },
          },
        },
      },
      orderBy: {
        event: {
          date: 'asc',
        },
      },
    });

    const events = reminders.map((r) => ({
      id: r.event.id,
      title: r.event.title,
      city: r.event.city,
      date: r.event.date,
      time: r.event.time,
      price: r.event.price,
      description: r.event.description,
      imageUrl: r.event.imageUrl,
      isActive: r.event.isActive,
      category: r.event.category.name,
      categoryId: r.event.categoryId,
      hasReminder: true,
      remindersCount: r.event._count.reminders,
    }));

    return NextResponse.json({ data: events });
  } catch (error) {
    console.error('Error fetching user reminders:', error);
    return NextResponse.json(
      { error: 'Internal server error while fetching reminders' },
      { status: 500 }
    );
  }
}
