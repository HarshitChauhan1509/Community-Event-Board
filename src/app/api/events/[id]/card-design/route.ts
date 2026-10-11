import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { z } from 'zod';

const cardDesignSchema = z.object({
  theme: z.enum(['editorial-cream', 'midnight-ink', 'terracotta-glow']),
  stickers: z.array(z.string()).max(3, 'Maximum 3 stickers allowed'),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: eventId } = await params;

    const design = await prisma.eventCardDesign.findUnique({
      where: {
        userId_eventId: {
          userId: sessionUser.id,
          eventId,
        },
      },
    });

    if (!design) {
      return NextResponse.json({ data: null });
    }

    return NextResponse.json({
      data: {
        theme: design.theme,
        stickers: JSON.parse(design.stickers || '[]'),
      },
    });
  } catch (error) {
    console.error('Error fetching card design:', error);
    return NextResponse.json(
      { error: 'Internal server error while fetching card design' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: eventId } = await params;

    const json = await request.json();
    const result = cardDesignSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { theme, stickers } = result.data;

    // Verify event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Persist design via upsert
    const saved = await prisma.eventCardDesign.upsert({
      where: {
        userId_eventId: {
          userId: sessionUser.id,
          eventId,
        },
      },
      update: {
        theme,
        stickers: JSON.stringify(stickers),
      },
      create: {
        userId: sessionUser.id,
        eventId,
        theme,
        stickers: JSON.stringify(stickers),
      },
    });

    return NextResponse.json({
      message: 'Design saved successfully',
      data: {
        theme: saved.theme,
        stickers: JSON.parse(saved.stickers),
      },
    });
  } catch (error) {
    console.error('Error saving card design:', error);
    return NextResponse.json(
      { error: 'Unable to save design' },
      { status: 500 }
    );
  }
}
