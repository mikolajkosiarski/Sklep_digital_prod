import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const journal = defineCollection({
  loader: glob({ base: './src/content/journal', pattern: '*.md' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    category: z.string().min(1),
    published: z.iso.date(),
    author: z.literal('mikolaj'),
    tags: z.array(z.string().min(1)).min(1),
    readTime: z.string().min(1),
    art: z.enum(['formats', 'ornaments', 'textures']),
    order: z.number().int().positive(),
    figure: z.object({
      image: z.enum([
        'assets/digital/pack-100-3.png',
        'assets/digital/pack-121-3.png',
        'assets/digital/pack-300-3.png',
        'assets/frames/brd0125_nb_4096x4096.png',
        'textures/serpent.svg',
      ]),
      alt: z.string().min(1),
      caption: z.string().min(1),
    }),
    sources: z
      .array(
        z.object({
          title: z.string().min(1),
          url: z
            .url()
            .refine((value) => /^https?:\/\//i.test(value), 'Source links must use HTTP(S)'),
        }),
      )
      .default([]),
  }),
});

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

// Product assets are local files, never arbitrary URLs or filesystem paths.
const listingFilename = z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]*\.(?:jpe?g|png|webp)$/i);
const productId = z.string().regex(/^[1-9]\d*$/);

const products = defineCollection({
  loader: glob({ base: './src/content/products', pattern: '*.md' }),
  schema: z.object({
    priceMinor: z.number().int().positive(),
    designCount: z.number().int().positive(),
    resolution: z.string().min(1),
    resolutionDetail: z.string().min(1),
    dpi: z.number().int().positive().optional(),
    motifs: z.array(z.string().min(1)).min(1),
    packaging: z.string().min(1),
    gallery: z.array(z.object({ file: listingFilename, alt: z.string().min(1) })).min(1),
    relatedIds: z.array(productId),
    video: z
      .object({
        src: z.string().regex(/^assets\/video\/[a-zA-Z0-9][a-zA-Z0-9_-]*\.mp4$/),
        poster: listingFilename,
        description: z.string().min(1),
      })
      .optional(),
  }),
});

export const collections = { journal, information, products };
