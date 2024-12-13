
// src/types/reviews.ts
export interface Review {
  id: string;
  provider_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}