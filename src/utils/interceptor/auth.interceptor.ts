import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {Auth} from '../api/auth';
import {catchError, switchMap, throwError} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';

let isRefreshing = false;

export const authTokenInterceptor : HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const cookieService = inject(CookieService);

  if (!cookieService.get('token')) {
    return next(req);
  }

  if (isRefreshing) {
    return refreshToken(auth, req, next)
  }

  return next(addToken(req, cookieService.get('token'))).pipe(
    catchError(err => {
      if (err.status == 401) {
        return refreshToken(auth, req, next)
      }

      return throwError(err);
    })
  );
}

const refreshToken = (
  auth : Auth,
  req : HttpRequest<any>,
  next : HttpHandlerFn
)  => {
  if (!isRefreshing) {
    isRefreshing = true;

    return auth.refreshAuthToken()
      .pipe(
        switchMap(token => {
          isRefreshing = false;
          return next(addToken(req, token.accessToken));
        })
      )
  }

  return next(addToken(req,  inject(CookieService).get('token')!))
}

const addToken = (req : HttpRequest<any>,  token : string) => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  })
}
