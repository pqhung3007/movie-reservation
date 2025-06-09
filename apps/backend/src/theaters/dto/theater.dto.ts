import { z } from 'zod';

export const createTheaterSchema = z.object({
  name: z.string(),
  dailyMovieLimit: z.number().int().min(1).default(5),
  dailyShowtimeLimit: z.number().int().min(1).default(10),
});

export const updateTheaterSchema = createTheaterSchema.partial();

export type ICreateTheaterDto = z.infer<typeof createTheaterSchema>;
export type IUpdateTheaterDto = z.infer<typeof updateTheaterSchema>;
