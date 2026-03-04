import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {ApiConfig} from '../../shared/config/api.config';
import {TopicListInterface} from '../../entities/topic/topic-list.interface';
import {TopicDetailInterface} from '../../entities/topic/topic-detail.interface';
import {TopicUpsertInterface} from '../../entities/topic/topic-upsert.interface';
import {TopicPreviewInterface} from '../../entities/topic/topic-preview.interface';
import {TopicFilterInterface} from '../../entities/topic/topic-filter.interface';

@Injectable({
  providedIn: 'root'
})
export class Topic {
  http = inject(HttpClient);
  router = inject(Router);
  cookieService = inject(CookieService);

  baseApiUrl = inject(ApiConfig).getBaseApiUrl() + 'topics';

  getPreview(page: number, size: number = 10) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'createdAt')
      .set('direction', 'desc');

    return this.http.get<TopicListInterface>(
      `${this.baseApiUrl}/preview`, {params});
  }

  getTopic(id : string) {
    return this.http.get<TopicDetailInterface>(
      `${this.baseApiUrl}/${id}`);
  }

  createTopic(payload: TopicUpsertInterface) {
    return this.http.post<TopicDetailInterface>(
      `${this.baseApiUrl}`,
      payload
    );
  }

  updateTopic(id: string, payload: TopicUpsertInterface) {
    return this.http.put<TopicDetailInterface>(
      `${this.baseApiUrl}/${id}`,
      payload
    );
  }

  deleteTopic(id: string) {
    return this.http.delete(
      `${this.baseApiUrl}/${id}`
    );
  }

  getTopicsByAuthor(authorId: string) {
    return this.http.get<TopicPreviewInterface[]>(
      `${this.baseApiUrl}/author/${authorId}`
    );
  }

  filterTopics(params: TopicFilterInterface) {
    let httpParams = new HttpParams();

    if (params.authorId) {
      httpParams = httpParams.set('authorId', params.authorId);
    }

    if (params.tags) {
      const tags = Array.isArray(params.tags) ? params.tags.join(',') : params.tags;
      httpParams = httpParams.set('tags', tags);
    }

    if (params.priority) {
      httpParams = httpParams.set('priority', params.priority);
    }

    if (params.fromDate) {
      httpParams = httpParams.set('fromDate', params.fromDate);
    }

    if (params.toDate) {
      httpParams = httpParams.set('toDate', params.toDate);
    }

    return this.http.get<TopicPreviewInterface[]>(
      `${this.baseApiUrl}/filter`,
      {params: httpParams}
    );
  }
}
