import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { ProjectDto, CreateProjectRequest } from '../models/project.model';
import { UserDto } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly apiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<ProjectDto[]>(this.apiUrl);
  }

  getMy() {
    return this.http.get<ProjectDto[]>(`${this.apiUrl}/my`);
  }

  getById(id: number) {
    return this.http.get<ProjectDto>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateProjectRequest) {
    return this.http.post<ProjectDto>(this.apiUrl, request);
  }

  getMembers(projectId: number) {
    return this.http.get<UserDto[]>(`${this.apiUrl}/${projectId}/members`);
  }

  addMember(projectId: number, userId: number) {
    return this.http.post<ProjectDto>(`${this.apiUrl}/${projectId}/members/${userId}`, {});
  }
}
