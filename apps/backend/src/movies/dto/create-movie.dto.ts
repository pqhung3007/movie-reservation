import { z } from 'zod';

export const createMovieSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  releaseDate: z.string().optional(), // ISO date string
  duration: z.number().int().positive(),
  imageUrl: z.string().url().optional(),
  categoryId: z.string().optional(),
});

export type ICreateMovieDto = z.infer<typeof createMovieSchema>;
