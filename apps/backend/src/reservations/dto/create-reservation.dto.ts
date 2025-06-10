import { z } from 'zod';

export const createReservationSchema = z.object({
  userId: z.string().uuid(),
  showtimeId: z.string().uuid(),
  seat: z.string().regex(/^[A-H][1-8]$/), // A1 to H8
});

export type ICreateReservationDto = z.infer<typeof createReservationSchema>;
