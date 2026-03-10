import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectService } from '../core/services/project.service';
import { SprintService } from '../core/services/sprint.service';
import { TaskService } from '../core/services/task.service';
import { LabelService } from '../core/services/label.service';
import { ProjectDto } from '../core/models/project.model';
import { SprintDto } from '../core/models/sprint.model';
import { TaskDto } from '../core/models/task.model';
import { LabelDto } from '../core/models/label.model';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container" *ngIf="project">
      <div class="page-header">
        <div>
          <h1>{{ project.name }}</h1>
          <p class="description">{{ project.description }}</p>
        </div>
      </div>

      <!-- Sprints -->
      <div class="section">
        <div class="section-header">
          <h2>Sprints</h2>
          <button class="btn btn-primary btn-sm" (click)="showCreateSprint = true">
            <span class="material-icons">add</span> New Sprint
          </button>
        </div>
        @if (sprints.length === 0) {
          <p class="text-muted">No sprints yet.</p>
        } @else {
          <div class="sprint-list">
            @for (sprint of sprints; track sprint.id) {
              <div class="card sprint-card">
                <div class="sprint-info">
                  <h3>{{ sprint.name }}</h3>
                  <span class="badge badge-sprint-{{ sprint.status }}">{{ sprint.status }}</span>
                </div>
                <p class="sprint-goal" *ngIf="sprint.goal">{{ sprint.goal }}</p>
                <div class="sprint-dates">
                  {{ sprint.startDate }} &mdash; {{ sprint.endDate }}
                </div>
                <div class="sprint-actions">
                  <a [routerLink]="['/projects', project.id, 'board', sprint.id]" class="btn btn-outline btn-sm">
                    <span class="material-icons">view_kanban</span> Board
                  </a>
                  @if (sprint.status === 'PLANNING') {
                    <button class="btn btn-primary btn-sm" (click)="activateSprint(sprint)">Activate</button>
                  }
                  @if (sprint.status === 'ACTIVE') {
                    <button class="btn btn-outline btn-sm" (click)="completeSprint(sprint)">Complete</button>
                  }
                </div>
              </div>
            }
          </div>
        }
      </div>

      <!-- Backlog Tasks -->
      <div class="section">
        <div class="section-header">
          <h2>Tasks ({{ tasks.length }})</h2>
          <a [routerLink]="['/projects', project.id, 'board']" class="btn btn-outline btn-sm">
            <span class="material-icons">view_kanban</span> Full Board
          </a>
        </div>
        @if (tasks.length === 0) {
          <p class="text-muted">No tasks yet.</p>
        } @else {
          <div class="task-list">
            @for (task of tasks; track task.id) {
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

      <!-- Labels -->
      <div class="section">
        <div class="section-header">
          <h2>Labels</h2>
          <button class="btn btn-outline btn-sm" (click)="showCreateLabel = true">
            <span class="material-icons">add</span> Label
          </button>
        </div>
        <div class="label-list">
          @for (label of labels; track label.id) {
            <span class="label-tag" [style.background]="label.color + '22'" [style.color]="label.color">
              {{ label.name }}
            </span>
          }
        </div>
      </div>

      <!-- Create Sprint Modal -->
      @if (showCreateSprint) {
        <div class="modal-backdrop" (click)="showCreateSprint = false">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>New Sprint</h2>
              <button class="btn btn-outline btn-sm" (click)="showCreateSprint = false">
                <span class="material-icons">close</span>
              </button>
            </div>
            <form (ngSubmit)="createSprint()">
              <div class="form-group">
                <label>Sprint Name</label>
                <input name="sprintName" [(ngModel)]="newSprint.name" required>
              </div>
              <div class="form-group">
                <label>Goal</label>
                <textarea name="sprintGoal" [(ngModel)]="newSprint.goal"></textarea>
              </div>
              <div class="grid grid-2">
                <div class="form-group">
                  <label>Start Date</label>
                  <input name="startDate" type="date" [(ngModel)]="newSprint.startDate" required>
                </div>
                <div class="form-group">
                  <label>End Date</label>
                  <input name="endDate" type="date" [(ngModel)]="newSprint.endDate" required>
                </div>
              </div>
              <div class="modal-actions">
                <button type="button" class="btn btn-outline" (click)="showCreateSprint = false">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="!newSprint.name || !newSprint.startDate || !newSprint.endDate">Create</button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Create Label Modal -->
      @if (showCreateLabel) {
        <div class="modal-backdrop" (click)="showCreateLabel = false">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>New Label</h2>
              <button class="btn btn-outline btn-sm" (click)="showCreateLabel = false">
                <span class="material-icons">close</span>
              </button>
            </div>
            <form (ngSubmit)="createLabel()">
              <div class="form-group">
                <label>Name</label>
                <input name="labelName" [(ngModel)]="newLabel.name" required>
              </div>
              <div class="form-group">
                <label>Color</label>
                <input name="labelColor" type="color" [(ngModel)]="newLabel.color" required>
              </div>
              <div class="modal-actions">
                <button type="button" class="btn btn-outline" (click)="showCreateLabel = false">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="!newLabel.name">Create</button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .description { color: var(--text-secondary); margin-top: 4px; }
    .section { margin-top: 32px; }
    .section-header {
      display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;
      h2 { font-size: 18px; font-weight: 600; }
    }
    .text-muted { color: var(--text-muted); font-size: 14px; }
    .sprint-list { display: flex; flex-direction: column; gap: 8px; }
    .sprint-card { padding: 16px; }
    .sprint-info {
      display: flex; align-items: center; gap: 10px;
      h3 { font-size: 15px; font-weight: 600; }
    }
    .sprint-goal { font-size: 14px; color: var(--text-secondary); margin-top: 6px; }
    .sprint-dates { font-size: 13px; color: var(--text-muted); margin-top: 4px; }
    .sprint-actions { display: flex; gap: 8px; margin-top: 10px; }
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
    .label-list { display: flex; flex-wrap: wrap; gap: 6px; }
    .label-tag {
      padding: 4px 10px; border-radius: 12px; font-size: 13px; font-weight: 500;
    }
  `],
})
export class ProjectDetailComponent implements OnInit {
  project: ProjectDto | null = null;
  sprints: SprintDto[] = [];
  tasks: TaskDto[] = [];
  labels: LabelDto[] = [];

  showCreateSprint = false;
  showCreateLabel = false;

  newSprint = { name: '', goal: '', startDate: '', endDate: '' };
  newLabel = { name: '', color: '#4f46e5' };

  private projectId!: number;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private sprintService: SprintService,
    private taskService: TaskService,
    private labelService: LabelService,
  ) {}

  ngOnInit() {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAll();
  }

  loadAll() {
    this.projectService.getById(this.projectId).subscribe(p => this.project = p);
    this.sprintService.getByProject(this.projectId).subscribe(s => this.sprints = s);
    this.taskService.getByProject(this.projectId).subscribe(t => this.tasks = t);
    this.labelService.getByProject(this.projectId).subscribe(l => this.labels = l);
  }

  createSprint() {
    this.sprintService.create(this.projectId, this.newSprint).subscribe(() => {
      this.showCreateSprint = false;
      this.newSprint = { name: '', goal: '', startDate: '', endDate: '' };
      this.sprintService.getByProject(this.projectId).subscribe(s => this.sprints = s);
    });
  }

  activateSprint(sprint: SprintDto) {
    this.sprintService.activate(this.projectId, sprint.id).subscribe(() => {
      this.sprintService.getByProject(this.projectId).subscribe(s => this.sprints = s);
    });
  }

  completeSprint(sprint: SprintDto) {
    this.sprintService.complete(this.projectId, sprint.id).subscribe(() => {
      this.sprintService.getByProject(this.projectId).subscribe(s => this.sprints = s);
    });
  }

  createLabel() {
    this.labelService.create(this.projectId, this.newLabel).subscribe(() => {
      this.showCreateLabel = false;
      this.newLabel = { name: '', color: '#4f46e5' };
      this.labelService.getByProject(this.projectId).subscribe(l => this.labels = l);
    });
  }
}
