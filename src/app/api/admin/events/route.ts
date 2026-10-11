import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/auth';
import { createEventSchema } from '@/lib/validations/event';

export async function GET() {
  try {
    const admin = await requireAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
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
    });

    const data = events.map((e) => ({
      id: e.id,
      title: e.title,
      city: e.city,
      date: e.date,
      time: e.time,
      price: e.price,
      description: e.description,
      imageUrl: e.imageUrl,
      isActive: e.isActive,
      category: e.category.name,
      categoryId: e.categoryId,
      remindersCount: e._count.reminders,
      createdAt: e.createdAt,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching admin events:', error);
    return NextResponse.json(
      { error: 'Internal server error while fetching admin events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const json = await request.json();
    const result = createEventSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, categoryId, city, date, time, price, description, imageUrl, isActive } =
      result.data;

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json({ error: 'Invalid category specified' }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title,
        categoryId,
        city,
        date: new Date(date),
        time,
        price,
        description,
        imageUrl,
        isActive: isActive ?? true,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Event created successfully',
        data: event,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Internal server error while creating event' },
      { status: 500 }
    );
  }
}
