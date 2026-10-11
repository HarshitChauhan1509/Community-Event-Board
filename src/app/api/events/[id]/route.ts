import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionUser = await getSessionUser();

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        reminders: sessionUser
          ? {
              where: {
                userId: sessionUser.id,
              },
              select: {
                id: true,
              },
            }
          : false,
        designs: sessionUser
          ? {
              where: {
                userId: sessionUser.id,
              },
              select: {
                id: true,
                theme: true,
                stickers: true,
              },
            }
          : false,
        _count: {
          select: {
            reminders: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const customDesign =
      event.designs && event.designs.length > 0
        ? {
            theme: event.designs[0].theme,
            stickers: JSON.parse(event.designs[0].stickers || '[]'),
          }
        : null;

    return NextResponse.json({
      data: {
        id: event.id,
        title: event.title,
        city: event.city,
        date: event.date,
        time: event.time,
        price: event.price,
        description: event.description,
        imageUrl: event.imageUrl,
        isActive: event.isActive,
        category: event.category.name,
        categoryId: event.categoryId,
        hasReminder: Boolean(event.reminders && event.reminders.length > 0),
        remindersCount: event._count.reminders,
        customDesign,
      },
    });
  } catch (error) {
    console.error('Error fetching event details:', error);
    return NextResponse.json(
      { error: 'Internal server error while fetching event details' },
      { status: 500 }
    );
  }
}
