import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from './admin.service';

@Component({
  selector: 'app-admin-login',
  imports: [ReactiveFormsModule],
  template: `
    <div class="admin-ui page">
      <form class="card" [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <img src="images/logo/logo-footer.png" alt="Dugar Capital Advisors" class="logo" />
        <h1>Admin Login</h1>
        <p class="lead">Sign in to manage blog posts and website enquiries.</p>

        @if (!admin.configured()) {
          <p class="alert" role="alert">Admin is not configured on the server yet.</p>
        }

        <label class="a-field">Username
          <input class="a-input" type="text" formControlName="username" autocomplete="username" autofocus />
        </label>

        <label class="a-field">Password
          <span class="pw">
            <input class="a-input" [type]="showPassword() ? 'text' : 'password'" formControlName="password" autocomplete="current-password" />
            <button type="button" class="eye" (click)="showPassword.set(!showPassword())"
                    [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'" [attr.aria-pressed]="showPassword()">
              @if (showPassword()) {
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.940 17.940A10.070 10.070 0 0 1 12 20c-7 0-11-8-11-8a18.450 18.450 0 0 1 5.060-5.940M9.900 4.240A9.120 9.120 0 0 1 12 4c7 0 11 8 11 8a18.500 18.500 0 0 1-2.160 3.190m-6.720-1.070a3 3 0 1 1-4.240-4.240"/><path d="M1 1l22 22"/></svg>
              } @else {
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </button>
          </span>
        </label>

        @if (message()) { <p class="alert" role="alert">{{ message() }}</p> }

        <button class="a-btn a-btn-primary submit" type="submit" [disabled]="busy()">{{ busy() ? 'Signing in…' : 'Sign in' }}</button>
      </form>
    </div>
  `,
  styles: `
    .page { display: grid; place-items: center; min-height: 100vh; padding: 24px 16px; background: var(--a-bg); }
    .card {
      display: grid; gap: 16px; width: min(420px, 100%); padding: 36px 34px 32px;
      background: #fff; border: 1px solid var(--a-border); border-top: 4px solid var(--a-primary); border-radius: var(--a-radius); box-shadow: 0 12px 40px rgba(27, 21, 18, .10);
    }
    .logo { height: 54px; width: auto; margin: 0 auto 4px; }
    h1 { font-size: 24px; text-align: center; }
    .lead { margin: -6px 0 6px; text-align: center; color: var(--a-muted); font-size: 14px; }
    .pw { position: relative; display: block; .a-input { padding-right: 46px; } }
    .eye {
      position: absolute; top: 0; right: 0; bottom: 0; width: 44px; display: flex; align-items: center; justify-content: center;
      border: 0; border-radius: 0 var(--a-radius) var(--a-radius) 0; background: none; color: var(--a-muted); cursor: pointer;
      &:hover { color: var(--a-text); }
      &:focus-visible { outline: 2px solid var(--a-primary); outline-offset: -2px; }
    }
    .alert { padding: 10px 12px; border-radius: var(--a-radius); background: var(--a-danger-soft); color: #b42318; font-weight: 600; font-size: 13px; }
    .submit { width: 100%; height: 44px; margin-top: 4px; }
  `,
})
export class AdminLogin {
  protected readonly admin = inject(AdminService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly busy = signal(false);
  protected readonly message = signal('');
  protected readonly showPassword = signal(false);
  protected readonly form = this.fb.nonNullable.group({ username: '', password: '' });

  protected async submit() {
    this.busy.set(true);
    this.message.set('');
    const { username, password } = this.form.getRawValue();
    const r = await this.admin.login(username, password);
    this.busy.set(false);
    if (r.ok) {
      this.form.reset();
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.message.set(r.message ?? 'Could not sign in.');
    }
  }
}
