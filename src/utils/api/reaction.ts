import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiConfig} from '../../shared/config/api.config';
import {ReactionSummaryInterface, ReactionType} from '../../entities/reaction/reaction-summary.interface';

@Injectable({
  providedIn: 'root'
})
export class Reaction {
  private readonly http = inject(HttpClient);
  private readonly baseApiUrl = inject(ApiConfig).getBaseApiUrl() + 'reactions';

  reactToTopic(topicId: string, type: ReactionType) {
    return this.http.post(`${this.baseApiUrl}/topics/${topicId}`, {type});
  }

  reactToComment(commentId: string, type: ReactionType) {
    return this.http.post(`${this.baseApiUrl}/comments/${commentId}`, {type});
  }

  getForTopic(topicId: string) {
    return this.http.get<ReactionSummaryInterface>(`${this.baseApiUrl}/topics/${topicId}`);
  }

  getForComment(commentId: string) {
    return this.http.get<ReactionSummaryInterface>(`${this.baseApiUrl}/comments/${commentId}`);
  }

  removeFromTopic(topicId: string) {
    return this.http.delete(`${this.baseApiUrl}/topics/${topicId}`);
  }

  removeFromComment(commentId: string) {
    return this.http.delete(`${this.baseApiUrl}/comments/${commentId}`);
  }
}
