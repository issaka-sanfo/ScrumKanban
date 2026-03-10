import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="navbar-brand">
        <span class="material-icons">dashboard</span>
        <a routerLink="/dashboard">ScrumKanban</a>
      </div>
      <div class="navbar-links">
        <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Dashboard</a>
        <a routerLink="/projects" routerLinkActive="active">Projects</a>
      </div>
      <div class="navbar-user">
        <div class="avatar">{{ initials }}</div>
        <span class="user-name">{{ auth.user()?.fullName }}</span>
        <button class="btn btn-outline btn-sm" (click)="auth.logout()">Logout</button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      height: 56px;
      padding: 0 24px;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      gap: 32px;
    }
    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      font-size: 18px;
      a { color: var(--text); text-decoration: none; }
      .material-icons { color: var(--primary); }
    }
    .navbar-links {
      display: flex;
      gap: 4px;
      a {
        padding: 6px 14px;
        border-radius: var(--radius);
        font-size: 14px;
        font-weight: 500;
        color: var(--text-secondary);
        text-decoration: none;
        transition: all 0.15s;
        &:hover { background: var(--bg); color: var(--text); }
        &.active { background: var(--primary-light); color: var(--primary); }
      }
    }
    .navbar-user {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .user-name {
      font-size: 14px;
      font-weight: 500;
    }
  `],
})
export class NavbarComponent {
  constructor(public auth: AuthService) {}

  get initials(): string {
    const name = this.auth.user()?.fullName || '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
