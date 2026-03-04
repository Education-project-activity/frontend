import { TopicPreviewInterface } from './topic-preview.interface';

interface SortInterface {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

interface PageableInterface {
  pageNumber: number;
  pageSize: number;
  sort: SortInterface;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface TopicListInterface {
  content: TopicPreviewInterface[];
  pageable: PageableInterface;

  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;

  sort: SortInterface;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
