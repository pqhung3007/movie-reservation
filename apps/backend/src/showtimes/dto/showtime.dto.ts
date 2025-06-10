import { z } from 'zod';

export const createShowtimeSchema = z.object({
  startTime: z.string().datetime(),
  movieId: z.string().uuid(),
  theaterId: z.string().uuid(),
});

export const updateShowtimeSchema = createShowtimeSchema.partial();

export type ICreateShowtimeDto = z.infer<typeof createShowtimeSchema>;
export type IUpdateShowtimeDto = z.infer<typeof updateShowtimeSchema>;
