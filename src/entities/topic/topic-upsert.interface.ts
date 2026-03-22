import {EditorData} from './topic-detail.interface';

export interface TopicUpsertInterface {
  title: string;
  description: string;
  content: EditorData;
  imageUrl?: string;
  imageBase64?: string;
  priority?: boolean;
  tags?: string[];
}
