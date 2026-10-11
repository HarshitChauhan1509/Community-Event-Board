import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Fetch user's favourite categories
    const userFavourites = await prisma.favouriteCategory.findMany({
      where: { userId: sessionUser.id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (userFavourites.length === 0) {
      return NextResponse.json({
        data: [],
        hasFavourites: false,
        favouriteCategories: [],
      });
    }

    const favouriteCategoryIds = userFavourites.map((f) => f.categoryId);
    const favouriteCategoryNames = userFavourites.map((f) => f.category.name);

    // 2. Fetch upcoming, active events in user's favourite categories
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const events = await prisma.event.findMany({
      where: {
        isActive: true,
        date: {
          gte: now,
        },
        categoryId: {
          in: favouriteCategoryIds,
        },
      },
      orderBy: {
        date: 'asc',
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        reminders: {
          where: {
            userId: sessionUser.id,
          },
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            reminders: true,
          },
        },
      },
    });

    const formattedEvents = events.map((event) => ({
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
    }));

    return NextResponse.json({
      data: formattedEvents,
      hasFavourites: true,
      favouriteCategories: favouriteCategoryNames,
    });
  } catch (error) {
    console.error('Error fetching feed:', error);
    return NextResponse.json(
      { error: 'Internal server error while fetching personalized feed' },
      { status: 500 }
    );
  }
}
