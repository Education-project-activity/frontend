import {EditorData} from './topic-detail.interface';

export interface TopicUpsertInterface {
  type: 'news' | 'event';
  title: string;
  description: string;
  content: EditorData;
  eventDate: string;
  imageUrl: string;
  priority: boolean;
  tags: string[];
}
