import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  TuiAlertService,
  TuiButton,
  TuiIcon,
  TuiLink,
  TuiTextfield
} from '@taiga-ui/core';
import {TuiPassword} from '@taiga-ui/kit';
import {Auth} from '../../../utils/api/auth';
import {catchError, of} from 'rxjs';
import {RegisterInterface} from '../../../entities/auth/register.interface';

@Component({
  selector: 'app-register',
    imports: [
        CommonModule,
        RouterLink,
        RouterLinkActive,
        ReactiveFormsModule,
        TuiTextfield,
        TuiPassword,
        TuiButton,
        TuiLink,
        TuiIcon
    ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  private readonly authService = inject(Auth);
  private readonly alerts = inject(TuiAlertService);
  private readonly router = inject(Router);

  isSubmitting = false;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    department: new FormControl('', Validators.required),
    position: new FormControl('', Validators.required),
  });

  onSubmit() {
    if (this.form.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    this.authService.register(this.form.value as RegisterInterface)
      .pipe(
        catchError(error => {
          this.isSubmitting = false;
          this.alerts.open('Не удалось завершить регистрацию', {
            label: 'Ошибка',
            appearance: 'negative',
          }).subscribe();
          return of(null);
        })
      )
      .subscribe(res => {
        this.isSubmitting = false;
        if (res) {
          this.router.navigate(['']);
        }
      });
  }
}
