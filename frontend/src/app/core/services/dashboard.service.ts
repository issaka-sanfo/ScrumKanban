import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { DashboardDto, SprintMetricsDto } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getSummary() {
    return this.http.get<DashboardDto>(this.apiUrl);
  }

  getSprintMetrics(sprintId: number) {
    return this.http.get<SprintMetricsDto>(`${this.apiUrl}/sprint/${sprintId}/metrics`);
  }
}
