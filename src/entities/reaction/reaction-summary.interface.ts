export type ReactionType = 'LIKE' | 'LOVE' | 'LAUGH' | 'WOW';

export interface ReactionSummaryInterface {
  counts: Record<ReactionType, number>;
  currentUserReaction: ReactionType | null;
}
