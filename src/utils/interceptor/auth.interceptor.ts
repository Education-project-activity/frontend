import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {Auth} from '../api/auth';
import {catchError, finalize, map, Observable, shareReplay, switchMap, throwError} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';

let isRefreshing = false;
let refreshTokenRequest$: Observable<string> | null = null;

export const authTokenInterceptor : HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const cookieService = inject(CookieService);
  const token = cookieService.get('token');

  if (!token) {
    return next(req);
  }

  if (isRefreshRequest(req)) {
    return next(addToken(req, token));
  }

  return next(addToken(req, token)).pipe(
    catchError(err => {
      if (err.status == 401) {
        return refreshToken(auth, req, next);
      }

      return throwError(err);
    })
  );
};

const refreshToken = (
  auth : Auth,
  req : HttpRequest<any>,
  next : HttpHandlerFn
)  => {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenRequest$ = auth.refreshAuthToken().pipe(
      map(token => token.accessToken),
      finalize(() => {
        isRefreshing = false;
        refreshTokenRequest$ = null;
      }),
      shareReplay(1)
    );
  }

  if (!refreshTokenRequest$) {
    return throwError(() => new Error('Refresh token request was not initialized'));
  }

  return refreshTokenRequest$.pipe(
    switchMap(token => next(addToken(req, token)))
  );
};

const isRefreshRequest = (req: HttpRequest<unknown>) => {
  return req.url.includes('/auth/refresh');
};

const addToken = (req : HttpRequest<any>,  token : string) => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
};
