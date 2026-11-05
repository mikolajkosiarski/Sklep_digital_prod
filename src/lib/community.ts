import { z } from 'astro/zod';
import content from '../data/community-content.json' with { type: 'json' };

function isPublicHttpsUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return (
      /^https:\/\//i.test(value) &&
      parsed.protocol === 'https:' &&
      Boolean(parsed.hostname) &&
      !parsed.username &&
      !parsed.password
    );
  } catch {
    return false;
  }
}

function isCalendarDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return year >= 1 && month >= 1 && month <= 12 && day >= 1 && day <= days[month - 1];
}

const suppliedText = z
  .string()
  .refine((value) => value.trim().length > 0, 'Supply the original nonempty text.');
const sourceUrl = z
  .string()
  .refine(isPublicHttpsUrl, 'Community links must be HTTPS URLs without credentials.');
const calendarDate = z
  .string()
  .refine(isCalendarDate, 'Use a valid ISO calendar date (YYYY-MM-DD).');

// Screenshots are retained in docs/sources/etsy-reviews, not served to visitors.
const reviewEvidence = z.object({
  file: z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]*\.png$/),
  capturedOn: calendarDate,
});

const communitySchema = z.object({
  reviews: z.object({
    sourceLabel: suppliedText,
    sourceUrl: sourceUrl.nullable(),
    verifiedOn: calendarDate.nullable(),
    items: z.array(
      z
        .object({
          quote: suppliedText,
          author: suppliedText,
          sourceUrl: sourceUrl.nullable(),
          evidence: reviewEvidence.optional(),
          rating: z.number().int().min(1).max(5).nullish(),
          date: calendarDate.nullish(),
          product: suppliedText.nullish(),
        })
        .refine((review) => Boolean(review.sourceUrl || review.evidence), {
          message: 'A review needs a source URL or a supplied screenshot reference.',
        }),
    ),
  }),
  socialProfiles: z.array(
    z.object({
      platform: suppliedText,
      handle: suppliedText.nullable(),
      url: sourceUrl.nullable(),
    }),
  ),
  editorNote: z.string(),
});

export type CommunityContent = z.infer<typeof communitySchema>;

/** Reject incomplete endorsements and unsafe links before any page is generated. */
export function readCommunityContent(value: unknown): CommunityContent {
  return communitySchema.parse(value);
}

export function formatReviewDate(value: string): string {
  calendarDate.parse(value);
  const [year, month, day] = value.split('-');
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${Number(day)} ${months[Number(month) - 1]} ${year}`;
}

export const community = readCommunityContent(content);
