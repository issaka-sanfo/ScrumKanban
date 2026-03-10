export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

export interface UserDto {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: Role;
}

export type Role = 'ADMIN' | 'SCRUM_MASTER' | 'DEVELOPER';
