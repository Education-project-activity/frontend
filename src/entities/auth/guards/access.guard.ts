import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {Auth} from '../../../utils/api/auth';


export const canActivateAuth = () => {
  const isLoggedIn = inject(Auth).isAuth;

  if (isLoggedIn) {
    return true;
  }

  return inject(Router).createUrlTree(['login']);
}
