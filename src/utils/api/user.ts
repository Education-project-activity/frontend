import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {ApiConfig} from '../../shared/config/api.config';
import {UserInfoInterface} from '../../entities/user/user-info.interface';

@Injectable({
  providedIn: 'root'
})
export class User {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly baseApiUrl = inject(ApiConfig).getBaseApiUrl() + 'users/';

  getUserByID = (id: string) =>  {
    return this.http.get<UserInfoInterface>(
      `${this.baseApiUrl}${id}`);
  }

  getMe() {
    return this.http.get<UserInfoInterface>(
      `${this.baseApiUrl}me`
    );
  }

  updateMe(payload: Partial<UserInfoInterface>) {
    return this.http.put<UserInfoInterface>(
      `${this.baseApiUrl}me`,
      payload
    );
  }
}
