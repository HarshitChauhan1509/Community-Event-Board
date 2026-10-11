import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  categoryId: z.string().min(1, 'Category is required'),
  city: z.string().trim().min(2, 'City is required'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Valid date is required',
  }),
  time: z.string().trim().min(1, 'Time is required'),
  price: z.coerce.number().min(0, 'Price must be 0 or greater'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  imageUrl: z.string().trim().url('Image URL must be a valid URL'),
  isActive: z.boolean().default(true),
});

export const updateEventSchema = createEventSchema.partial();

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
