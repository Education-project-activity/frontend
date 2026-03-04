import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, tap, throwError} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {ApiConfig} from '../../shared/config/api.config';
import {LoginResponse} from '../../entities/auth/auth.interface';
import {RegisterInterface} from '../../entities/auth/register.interface';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly cookieService = inject(CookieService);

  private readonly baseApiUrl = inject(ApiConfig).getBaseApiUrl() + 'auth/';

  get isAuth() {
    return !!this.cookieService.get('token');
  }

  get userId(): string | null {
    const id = this.cookieService.get('user_id');
    return id || null;
  }

  login(payload : {email: string, password: string}) {
    return this.http.post<LoginResponse>(
      `${this.baseApiUrl}login`,
      payload)
      .pipe(
        tap(val => this.saveToken(val) )
      );
  }

  register(payload: RegisterInterface) {
    return this.http.post<LoginResponse>(
      `${this.baseApiUrl}register`,
      payload
    ).pipe(
      tap(val => this.saveToken(val) )
    );;
  }

  logout() {
    this.cookieService.deleteAll();
    this.router.navigate(['/login']);
  }

  refreshAuthToken() {
    return this.http.post<LoginResponse>(
      `${this.baseApiUrl}refresh`,
      {
        refreshToken: this.cookieService.get('refresh_token'),
      }
    ).pipe(
      tap(val => this.saveToken(val)),
      catchError(err => {
        this.logout();
        return throwError(err);
      })
    )
  }

  saveToken(res: LoginResponse) {
    this.cookieService.set('token', res.accessToken);
    this.cookieService.set('refresh_token', res.refreshToken);
    this.cookieService.set('user_id', res.userId);
  }
}
