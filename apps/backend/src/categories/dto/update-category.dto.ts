import { createCategorySchema } from './create-category.dto';
import { z } from 'zod';

export const updateCategorySchema = createCategorySchema.partial();

export type IUpdateCategoryDto = z.infer<typeof updateCategorySchema>;
