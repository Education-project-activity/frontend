import {Component, inject, signal} from '@angular/core';
import {Topic} from '../../utils/api/topic';
import {TopicListInterface} from '../../entities/topic/topic-list.interface';
import {TopicPreview} from '../../widgets/topic-preview/topic-preview';
import {HttpParams} from '@angular/common/http';
import {TuiPagination} from '@taiga-ui/kit';
import {TopicPreviewInterface} from '../../entities/topic/topic-preview.interface';
import {PaginationConfig} from '../../shared/config/pagination.config';

@Component({
  selector: 'app-home-page',
  imports: [
    TopicPreview,
    TuiPagination
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  private readonly topicApi = inject(Topic);
  private readonly paginationConfig: PaginationConfig = inject(PaginationConfig);
  topicList = signal<TopicListInterface | null>(null);

  index = signal(0);

  goToPage(newIndex: number) {
    this.index.set(newIndex);
    this.loadData(this.index(), this.paginationConfig.getPageSize());
  }

  loadData(index: number, size: number) {
    this.topicApi.getPreview(index, size).subscribe(val => {
      this.topicList.set(val);
    });
  }

  constructor() {
    this.loadData(0, this.paginationConfig.getPageSize());
  }
}
