import { z } from 'zod';

export const filterMovieSchema = z.object({
  category: z.string().optional(),
  title: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type IFilterMovieDto = z.infer<typeof filterMovieSchema>;
