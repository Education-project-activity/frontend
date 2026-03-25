import {Component, inject} from '@angular/core';
import {User} from '../../utils/api/user';
import {Auth} from '../../utils/api/auth';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {TuiAlertService, TuiButton, TuiIcon, TuiTextfield} from '@taiga-ui/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {AvatarUpload} from '../../widgets/avatar-upload/avatar-upload';
import {UserInfoInterface} from '../../entities/user/user-info.interface';

@Component({
  selector: 'app-edit-profile-page',
  imports: [
    ReactiveFormsModule,
    TuiButton,
    TuiTextfield,
    FormsModule,
    TuiIcon,
    AvatarUpload,
  ],
  templateUrl: './edit-profile-page.html',
  styleUrl: './edit-profile-page.scss',
})
export class EditProfilePage {
  private readonly userApi = inject(User);
  private readonly auth = inject(Auth);
  private readonly alerts = inject(TuiAlertService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  meInfo: UserInfoInterface | null = null;

  protected meForm = new FormGroup({
    email: new FormControl('r', Validators.required),
    position: new FormControl('r', Validators.required),
    department: new FormControl('r', Validators.required),
  });

  constructor() {
    const authorId = this.auth.userId;
    if (authorId) {
      this.loadAuthorPage(authorId);
    }
  }

  private loadAuthorPage(authorId: string) {
    this.userApi.getUserByID(authorId).subscribe({
      next: (author) => {
        this.meInfo = author;

        this.meForm.setValue({
          email: author.email,
          position: author.position,
          department: author.department,
        });
      },
      error: () => {
        this.location.back();
      }
    });
  }

  logout() {
    this.auth.logout();
  }

  protected onImageChange(file: File | null): void {
    if (!file) {
      return;
    }

    this.userApi.postAvatar(file).subscribe({
      next: (author) => {
        this.meInfo = author;
        this.alerts
          .open('Аватар обновлен', {
            label: 'Обновлено',
            appearance: 'success',
          })
          .subscribe();
      },
      error: () => {
        this.alerts
          .open('Не удалось загрузить аватар', {
            label: 'Ошибка',
            appearance: 'negative',
          })
          .subscribe();
      },
    });
  }

  onSubmit() {
    if (this.meForm.invalid) {
      this.meForm.markAllAsTouched();
      return;
    }

    const payload = this.meForm.getRawValue();

    const request = this.userApi.putMe(payload);

    request.subscribe({
      next: author => {
        this.alerts
          .open('Информация в профиле обновлена', {
            label: 'Обновлено',
            appearance: 'success',
          })
          .subscribe();

        this.router.navigate(['/me']);
      },
      error: err => {
        this.alerts
          .open('Не удалось сохранить', {
            label: 'Ошибка',
            appearance: 'negative',
          })
          .subscribe();
      },
    });
  }
}
