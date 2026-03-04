import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiConfig} from '../../shared/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class Subscription {
  private readonly http = inject(HttpClient);
  private readonly baseApiUrl = inject(ApiConfig).getBaseApiUrl() + 'subscriptions';

  subscribeToTopic(topicId: string) {
    return this.http.post(`${this.baseApiUrl}/topics/${topicId}`, {});
  }

  unsubscribeFromTopic(topicId: string) {
    return this.http.delete(`${this.baseApiUrl}/topics/${topicId}`);
  }

  getTopicSubscriptions() {
    return this.http.get(`${this.baseApiUrl}/topics`);
  }

  getTopicStatus(topicId: string) {
    return this.http.get<{subscribed: boolean}>(`${this.baseApiUrl}/topics/${topicId}/status`);
  }
}
