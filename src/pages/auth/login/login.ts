import {Component, inject, signal} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TuiIcon,
        TuiTextfield,
        TuiButton,
        TuiLink,
        TuiAlertService} from '@taiga-ui/core';
import {TuiPassword} from '@taiga-ui/kit';
import {Auth} from '../../../utils/api/auth';
import {catchError} from 'rxjs';
import {of} from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
    TuiIcon,
    TuiTextfield,
    TuiPassword,
    TuiButton,
    TuiLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);

  private readonly alerts = inject(TuiAlertService);

  form = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })

  isPasswordVisible = signal<boolean>(false);

  onSubmit() {
    if (this.form.valid) {
      this.authService.login(this.form.value as {email: string, password: string})
        .pipe(
          catchError(error => {
            if (error.status === 401) {
              this.alerts
                .open('Неправильный email или пароль', {
                  label: 'Ошибка',
                  appearance: 'negative',})
                .subscribe();
            } else if (error.status === 0) {
              this.alerts
                .open('Ошибка подключения к серверу', {
                  label: 'Ошибка',
                  appearance: 'negative',})
                .subscribe();
            } else {
              this.alerts
                .open('Произошла ошибка при входе', {
                  label: 'Ошибка',
                  appearance: 'negative',})
                .subscribe();
            }
            return of(null);
          })
        )
        .subscribe(res => {
          if (res) {
            this.router.navigate(['']);
          }
        });
    }
  }
}
