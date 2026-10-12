import { z } from "zod";

export interface RedditThread {
  id: string;
  title: string;
  subreddit: string;
  score: number;
  numComments: number;
  createdAt: string;
  url: string;
  snippet: string; // max 200 chars
  topic: string;
  sourceBadge: string;
  isLive: boolean;
}

export const RedditSummarySchema = z.object({
  overallSentiment: z.string(),
  whatRedditorsLove: z.array(z.object({ claim: z.string(), threadId: z.string(), threadTitle: z.string() })),
  commonComplaints: z.array(z.object({ claim: z.string(), threadId: z.string(), threadTitle: z.string() })),
  scamsAndAvoid: z.array(z.object({ claim: z.string(), threadId: z.string(), threadTitle: z.string() })),
  hiddenGems: z.array(z.object({ claim: z.string(), threadId: z.string(), threadTitle: z.string() })),
  bestTimeToVisit: z.array(z.object({ claim: z.string(), threadId: z.string(), threadTitle: z.string() })),
  topPlacesMentioned: z.array(z.object({ name: z.string(), type: z.string(), threadId: z.string() }))
});

export type RedditSummary = z.infer<typeof RedditSummarySchema>;
