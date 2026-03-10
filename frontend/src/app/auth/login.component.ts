import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card card">
        <h1>Sign In</h1>
        <p class="subtitle">Welcome back to ScrumKanban</p>

        @if (error) {
          <div class="error-banner">{{ error }}</div>
        }

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="username">Username</label>
            <input id="username" name="username" [(ngModel)]="username" required autocomplete="username">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" name="password" type="password" [(ngModel)]="password" required autocomplete="current-password">
          </div>
          <button class="btn btn-primary btn-full" type="submit" [disabled]="loading || !loginForm.valid">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <p class="auth-footer">
          Don't have an account? <a routerLink="/register">Sign up</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg);
    }
    .auth-card {
      width: 400px;
      padding: 40px;
      h1 { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
      .subtitle { color: var(--text-secondary); margin-bottom: 24px; }
    }
    .btn-full { width: 100%; justify-content: center; padding: 10px; }
    .auth-footer { text-align: center; margin-top: 16px; font-size: 14px; color: var(--text-secondary); }
    .error-banner {
      background: #fef2f2;
      color: var(--danger);
      padding: 10px 14px;
      border-radius: var(--radius);
      font-size: 14px;
      margin-bottom: 16px;
    }
  `],
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Invalid credentials';
      },
    });
  }
}
