import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {Auth} from '../../../utils/api/auth';

export const redirectToOwnProfile = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  const userId = auth.userId;
  if (userId) {
    return router.createUrlTree(['author', userId]);
  }

  return router.createUrlTree(['login']);
};
