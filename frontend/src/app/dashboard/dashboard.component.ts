import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../core/services/dashboard.service';
import { TaskService } from '../core/services/task.service';
import { DashboardDto } from '../core/models/dashboard.model';
import { TaskDto } from '../core/models/task.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Dashboard</h1>
      </div>

      @if (dashboard) {
        <div class="grid grid-4 stats">
          <div class="stat-card card">
            <div class="stat-icon"><span class="material-icons">folder</span></div>
            <div class="stat-value">{{ dashboard.totalProjects }}</div>
            <div class="stat-label">Projects</div>
          </div>
          <div class="stat-card card">
            <div class="stat-icon sprint"><span class="material-icons">timer</span></div>
            <div class="stat-value">{{ dashboard.activeSprintsCount }}</div>
            <div class="stat-label">Active Sprints</div>
          </div>
          <div class="stat-card card">
            <div class="stat-icon tasks"><span class="material-icons">assignment</span></div>
            <div class="stat-value">{{ dashboard.myTasksCount }}</div>
            <div class="stat-label">My Tasks</div>
          </div>
          <div class="stat-card card">
            <div class="stat-icon done"><span class="material-icons">check_circle</span></div>
            <div class="stat-value">{{ completedCount }}</div>
            <div class="stat-label">Completed</div>
          </div>
        </div>

        @if (dashboard.sprintMetrics.length > 0) {
          <h2 class="section-title">Sprint Progress</h2>
          <div class="grid grid-2">
            @for (metric of dashboard.sprintMetrics; track metric.sprintId) {
              <div class="card sprint-metric">
                <div class="metric-header">
                  <h3>{{ metric.sprintName }}</h3>
                  <span class="metric-fraction">{{ metric.completedTasks }}/{{ metric.totalTasks }} tasks</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="metric.totalTasks ? (metric.completedTasks / metric.totalTasks * 100) : 0"></div>
                </div>
                <div class="metric-details">
                  <span>{{ metric.completedStoryPoints }}/{{ metric.totalStoryPoints }} story points</span>
                </div>
              </div>
            }
          </div>
        }
      }

      @if (myTasks.length > 0) {
        <h2 class="section-title">My Tasks</h2>
        <div class="task-list">
          @for (task of myTasks; track task.id) {
            <a [routerLink]="['/tasks', task.id]" class="task-row card">
              <span class="badge badge-priority-{{ task.priority }}">{{ task.priority }}</span>
              <span class="task-title">{{ task.title }}</span>
              <span class="badge badge-status-{{ task.status }}">{{ task.status.replace('_', ' ') }}</span>
              @if (task.storyPoints) {
                <span class="story-points">{{ task.storyPoints }} SP</span>
              }
            </a>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .stats { margin-bottom: 32px; }
    .stat-card {
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }
    .stat-icon {
      width: 40px; height: 40px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      background: var(--primary-light); color: var(--primary); margin-bottom: 4px;
      &.sprint { background: #dbeafe; color: #2563eb; }
      &.tasks { background: #fef3c7; color: #d97706; }
      &.done { background: #dcfce7; color: #16a34a; }
      .material-icons { font-size: 22px; }
    }
    .stat-value { font-size: 28px; font-weight: 700; }
    .stat-label { font-size: 13px; color: var(--text-secondary); }
    .section-title { font-size: 18px; font-weight: 600; margin: 24px 0 12px; }
    .sprint-metric { padding: 20px; }
    .metric-header {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;
      h3 { font-size: 15px; font-weight: 600; }
    }
    .metric-fraction { font-size: 13px; color: var(--text-secondary); }
    .progress-bar {
      height: 8px; background: var(--bg); border-radius: 4px; overflow: hidden;
    }
    .progress-fill {
      height: 100%; background: var(--primary); border-radius: 4px; transition: width 0.3s;
    }
    .metric-details { margin-top: 8px; font-size: 13px; color: var(--text-secondary); }
    .task-list { display: flex; flex-direction: column; gap: 6px; }
    .task-row {
      display: flex; align-items: center; gap: 12px; padding: 12px 16px;
      text-decoration: none; color: var(--text); transition: box-shadow 0.15s;
      &:hover { box-shadow: var(--shadow-md); }
    }
    .task-title { flex: 1; font-size: 14px; font-weight: 500; }
    .story-points {
      font-size: 12px; font-weight: 600; color: var(--text-secondary);
      background: var(--bg); padding: 2px 8px; border-radius: 10px;
    }
  `],
})
export class DashboardComponent implements OnInit {
  dashboard: DashboardDto | null = null;
  myTasks: TaskDto[] = [];

  constructor(
    private dashboardService: DashboardService,
    private taskService: TaskService,
  ) {}

  ngOnInit() {
    this.dashboardService.getSummary().subscribe(d => this.dashboard = d);
    this.taskService.getMy().subscribe(tasks => this.myTasks = tasks);
  }

  get completedCount(): number {
    return this.myTasks.filter(t => t.status === 'DONE').length;
  }
}
