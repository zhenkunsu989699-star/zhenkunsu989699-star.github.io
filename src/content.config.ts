import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const papers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/papers' }),
  schema: z.object({
    title: z.string(),
    titleEn: z.string().optional(),
    authors: z.array(z.string()),
    // published 已发表 / working 工作论文 / thesis 学位论文
    status: z.enum(['published', 'working', 'thesis']),
    venue: z.string(),
    venueEn: z.string().optional(),
    // 学位论文的出版地与授予单位，如“济南: 山东师范大学”
    publisher: z.string().optional(),
    year: z.number(),
    date: z.coerce.date(),
    volume: z.string().optional(),
    issue: z.string().optional(),
    pages: z.string().optional(),
    doi: z.string().optional(),
    url: z.string().optional(),
    pdf: z.string().optional(),
    lang: z.enum(['zh', 'en']),
    keywords: z.array(z.string()).default([]),
    abstract: z.string(),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { papers, notes };
