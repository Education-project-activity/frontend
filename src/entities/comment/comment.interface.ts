export interface CommentAuthorInfo {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  position: string;
  department: string;
}

export interface CommentResponse {
  id: string;
  topic_id: string;
  parent_id: string | null;
  author: CommentAuthorInfo;
  content: string;
  metadata: unknown;
  created_at: string;
  updated_at: string;
  replies: CommentResponse[];
}

export interface CommentPageInterface {
  content: CommentResponse[];
}

export interface CreateCommentRequest {
  topic_id: string;
  parent_id?: string | null;
  content: string;
  metadata?: unknown;
}
