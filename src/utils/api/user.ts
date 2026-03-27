import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiConfig} from '../../shared/config/api.config';
import {UserInfoInterface} from '../../entities/user/user-info.interface';
import {AuthorUpsertInterface} from '../../entities/user/author-upsert.Interface';

@Injectable({
  providedIn: 'root'
})
export class User {
  private readonly http = inject(HttpClient);

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

  getTop5() {
    return this.http.get<UserInfoInterface[]>(`${this.baseApiUrl}rating/preview`);
  }

  getTop25() {
    return this.http.get<UserInfoInterface[]>(`${this.baseApiUrl}rating`);
  }

  putMe(payload: AuthorUpsertInterface) {
    return this.http.put<UserInfoInterface>(`${this.baseApiUrl}me`, payload)
  }

  postAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.http.post<UserInfoInterface>(`${this.baseApiUrl}me/avatar`, formData);
  }
}
