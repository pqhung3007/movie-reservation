import { createMovieSchema } from './create-movie.dto';
import { z } from 'zod';

export const updateMovieSchema = createMovieSchema.partial();

export type IUpdateMovieDto = z.infer<typeof updateMovieSchema>;
