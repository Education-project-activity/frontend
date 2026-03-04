import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiConfig} from '../../shared/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class Event {
  private readonly http = inject(HttpClient);
  private readonly baseApiUrl = inject(ApiConfig).getBaseApiUrl() + 'events';

  create(payload: unknown) {
    return this.http.post(`${this.baseApiUrl}`, payload);
  }

  getActive() {
    return this.http.get(`${this.baseApiUrl}/active`);
  }

  subscribe(eventId: string) {
    return this.http.post(`${this.baseApiUrl}/${eventId}/subscribe`, {});
  }
}
