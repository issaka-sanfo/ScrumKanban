import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { LabelDto, CreateLabelRequest } from '../models/label.model';

@Injectable({ providedIn: 'root' })
export class LabelService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getByProject(projectId: number) {
    return this.http.get<LabelDto[]>(`${this.apiUrl}/projects/${projectId}/labels`);
  }

  create(projectId: number, request: CreateLabelRequest) {
    return this.http.post<LabelDto>(`${this.apiUrl}/projects/${projectId}/labels`, request);
  }

  delete(projectId: number, labelId: number) {
    return this.http.delete<void>(`${this.apiUrl}/projects/${projectId}/labels/${labelId}`);
  }
}
