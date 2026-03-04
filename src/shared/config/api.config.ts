import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiConfig {
  readonly baseApiUrl = 'http://localhost:8080/api/';

  getBaseApiUrl() {
    return this.baseApiUrl;
  }
}
