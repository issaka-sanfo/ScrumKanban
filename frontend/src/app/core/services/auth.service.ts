import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '@env/environment';
import { AuthResponse, LoginRequest, RegisterRequest, UserDto } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly tokenKey = 'auth_token';

  private currentUser = signal<UserDto | null>(null);
  readonly user = this.currentUser.asReadonly();
  readonly isLoggedIn = computed(() => !!this.currentUser());

  constructor(private http: HttpClient, private router: Router) {
    if (this.getToken()) {
      this.loadCurrentUser();
    }
  }

  login(request: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  register(request: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private handleAuth(res: AuthResponse) {
    localStorage.setItem(this.tokenKey, res.token);
    this.currentUser.set({
      id: 0,
      username: res.username,
      email: res.email,
      fullName: res.fullName,
      role: res.role as UserDto['role'],
    });
    this.loadCurrentUser();
  }

  private loadCurrentUser() {
    this.http.get<UserDto>(`${this.apiUrl}/me`).subscribe({
      next: user => this.currentUser.set(user),
      error: () => this.logout(),
    });
  }
}
