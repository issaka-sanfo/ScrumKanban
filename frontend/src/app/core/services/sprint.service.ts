import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { SprintDto, CreateSprintRequest } from '../models/sprint.model';

@Injectable({ providedIn: 'root' })
export class SprintService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getByProject(projectId: number) {
    return this.http.get<SprintDto[]>(`${this.apiUrl}/projects/${projectId}/sprints`);
  }

  getById(projectId: number, sprintId: number) {
    return this.http.get<SprintDto>(`${this.apiUrl}/projects/${projectId}/sprints/${sprintId}`);
  }

  create(projectId: number, request: CreateSprintRequest) {
    return this.http.post<SprintDto>(`${this.apiUrl}/projects/${projectId}/sprints`, request);
  }

  activate(projectId: number, sprintId: number) {
    return this.http.put<SprintDto>(`${this.apiUrl}/projects/${projectId}/sprints/${sprintId}/activate`, {});
  }

  complete(projectId: number, sprintId: number) {
    return this.http.put<SprintDto>(`${this.apiUrl}/projects/${projectId}/sprints/${sprintId}/complete`, {});
  }
}
