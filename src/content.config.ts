import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const information = defineCollection({
  loader: glob({ base: './src/content/information', pattern: '*.md' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    group: z.enum(['support', 'policies']),
    status: z.enum(['draft', 'ready']),
    order: z.number().int().positive(),
    updated: z.iso.date(),
  }),
});

export const collections = { information };
