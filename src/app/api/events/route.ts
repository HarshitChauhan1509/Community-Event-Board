import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get('limit') || '9', 10)));
    const category = searchParams.get('category')?.trim();
    const city = searchParams.get('city')?.trim();
    const q = searchParams.get('q')?.trim() || searchParams.get('search')?.trim();
    const includePast = searchParams.get('includePast') === 'true';
    const includeInactive = searchParams.get('includeInactive') === 'true';

    // Start of current day or exact current time
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Build Prisma query condition
    const where: Prisma.EventWhereInput = {};

    if (!includeInactive) {
      where.isActive = true;
    }

    if (!includePast) {
      where.date = {
        gte: now,
      };
    }

    if (category && category !== 'All') {
      where.category = {
        name: {
          equals: category,
        },
      };
    }

    if (city && city !== 'All') {
      where.city = {
        equals: city,
      };
    }

    if (q) {
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { city: { contains: q } },
      ];
    }

    const skip = (page - 1) * limit;

    // Get current user to check for reminders
    const sessionUser = await getSessionUser();

    // Fetch total and paginated data in parallel
    const [total, events] = await Promise.all([
      prisma.event.count({ where }),
      prisma.event.findMany({
        where,
        orderBy: {
          date: 'asc',
        },
        skip,
        take: limit,
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
          _count: {
            select: {
              reminders: true,
            },
          },
        },
      }),
    ]);

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

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: formattedEvents,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error: any) {
    if (error?.digest?.startsWith?.('NEXT_')) {
      throw error;
    }
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Internal server error while fetching events' },
      { status: 500 }
    );
  }
}
