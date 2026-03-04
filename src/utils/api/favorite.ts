import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiConfig} from '../../shared/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class Favorite {
  private readonly http = inject(HttpClient);
  private readonly baseApiUrl = inject(ApiConfig).getBaseApiUrl() + 'favorites';

  addTopic(topicId: string) {
    return this.http.post(`${this.baseApiUrl}/topics/${topicId}`, {});
  }

  getTopics() {
    return this.http.get(`${this.baseApiUrl}/topics`);
  }
}
