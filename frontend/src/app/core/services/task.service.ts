import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { TaskDto, CreateTaskRequest, UpdateTaskRequest, UpdateTaskStatusRequest } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getById(id: number) {
    return this.http.get<TaskDto>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateTaskRequest) {
    return this.http.post<TaskDto>(this.apiUrl, request);
  }

  update(id: number, request: UpdateTaskRequest) {
    return this.http.put<TaskDto>(`${this.apiUrl}/${id}`, request);
  }

  updateStatus(id: number, request: UpdateTaskStatusRequest) {
    return this.http.put<TaskDto>(`${this.apiUrl}/${id}/status`, request);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getBySprint(sprintId: number) {
    return this.http.get<TaskDto[]>(`${this.apiUrl}/sprint/${sprintId}`);
  }

  getByProject(projectId: number) {
    return this.http.get<TaskDto[]>(`${this.apiUrl}/project/${projectId}`);
  }

  getMy() {
    return this.http.get<TaskDto[]>(`${this.apiUrl}/my`);
  }
}
