import {Component, inject, signal} from '@angular/core';
import {User} from '../../utils/api/user';
import {UserInfoInterface} from '../../entities/user/user-info.interface';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-authors-top-page',
  imports: [
    RouterLink
  ],
  templateUrl: './authors-top-page.html',
  styleUrl: './authors-top-page.scss',
})
export class AuthorsTopPage {
  private readonly userApi = inject(User);

  authorTop = signal<UserInfoInterface[] | null>(null);

  constructor(private router: Router) {
    this.userApi.getTop25().subscribe((data) => {
      this.authorTop.set(data);
    })
  }
}
