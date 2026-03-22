export interface EditorBlock {
  id?: string;
  type: string;
  data: any;
}

export interface EditorData {
  time?: number;
  blocks: EditorBlock[];
  version?: string;
}

export interface TopicDetailInterface {
  id: string;
  authorId: string;
  title: string;
  description: string;
  content: EditorData;
  createdAt: string;
  eventDate: string;
  authorName: string;
  imageUrl: string;
  authorAvatarUrl?: string;
  priority: boolean;
  tags: string[];
}
