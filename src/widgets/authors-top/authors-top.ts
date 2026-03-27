import {Component, inject, signal} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {Router, RouterLink} from '@angular/router';
import {User} from '../../utils/api/user';
import {UserInfoInterface} from '../../entities/user/user-info.interface';

@Component({
  selector: 'app-authors-top',
  imports: [
    TuiButton,
    RouterLink
  ],
  templateUrl: './authors-top.html',
  styleUrl: './authors-top.scss',
})
export class AuthorsTop {
  private readonly userApi = inject(User);

  authorTop = signal<UserInfoInterface[] | null>(null);

  constructor(private router: Router) {
    this.userApi.getTop5().subscribe((data) => {
      this.authorTop.set(data);
    })
  }
}
