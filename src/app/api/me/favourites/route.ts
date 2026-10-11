import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { z } from 'zod';

const updateFavouritesSchema = z.object({
  categoryIds: z.array(z.string()),
});

export async function GET() {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const favourites = await prisma.favouriteCategory.findMany({
      where: { userId: sessionUser.id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        category: {
          name: 'asc',
        },
      },
    });

    return NextResponse.json({
      data: favourites.map((f) => ({
        id: f.category.id,
        name: f.category.name,
      })),
    });
  } catch (error) {
    console.error('Error fetching favourites:', error);
    return NextResponse.json(
      { error: 'Internal server error while fetching favourite categories' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const result = updateFavouritesSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { categoryIds } = result.data;

    // Use transaction to atomically replace favourites
    await prisma.$transaction(async (tx) => {
      // 1. Delete all existing favourites for this user
      await tx.favouriteCategory.deleteMany({
        where: { userId: sessionUser.id },
      });

      // 2. Insert new selections
      if (categoryIds.length > 0) {
        await Promise.all(
          categoryIds.map((categoryId) =>
            tx.favouriteCategory.create({
              data: {
                userId: sessionUser.id,
                categoryId,
              },
            })
          )
        );
      }
    });

    // Return updated favourites
    const updated = await prisma.favouriteCategory.findMany({
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

    return NextResponse.json({
      message: 'Favourite categories updated successfully',
      data: updated.map((f) => ({
        id: f.category.id,
        name: f.category.name,
      })),
    });
  } catch (error) {
    console.error('Error updating favourites:', error);
    return NextResponse.json(
      { error: 'Internal server error while updating favourite categories' },
      { status: 500 }
    );
  }
}
