import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiConfig} from '../../shared/config/api.config';
import {CommentPageInterface, CreateCommentRequest} from '../../entities/comment/comment.interface';

@Injectable({
  providedIn: 'root'
})
export class Comment {
  private readonly http = inject(HttpClient);
  private readonly baseApiUrl = inject(ApiConfig).getBaseApiUrl() + 'comments';

  getByTopic(topicId: string, page = 0, size = 20) {
    return this.http.get<CommentPageInterface>(
      `${this.baseApiUrl}/topic/${topicId}`,
      {params: {page, size}}
    );
  }

  create(payload: CreateCommentRequest) {
    return this.http.post(`${this.baseApiUrl}`, payload);
  }
}
