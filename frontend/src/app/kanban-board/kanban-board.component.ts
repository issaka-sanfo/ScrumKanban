import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TaskService } from '../core/services/task.service';
import { SprintService } from '../core/services/sprint.service';
import { LabelService } from '../core/services/label.service';
import { ProjectService } from '../core/services/project.service';
import { TaskDto, TASK_STATUSES, TaskStatus, PRIORITIES, Priority, CreateTaskRequest } from '../core/models/task.model';
import { SprintDto } from '../core/models/sprint.model';
import { LabelDto } from '../core/models/label.model';
import { UserDto } from '../core/models/auth.model';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="board-container">
      <div class="board-header">
        <div>
          <h1>Kanban Board</h1>
          @if (currentSprint) {
            <span class="badge badge-sprint-{{ currentSprint.status }}">{{ currentSprint.name }}</span>
          }
        </div>
        <div class="board-actions">
          @if (sprints.length > 1) {
            <select class="sprint-select" [(ngModel)]="selectedSprintId" (ngModelChange)="onSprintChange()">
              <option [ngValue]="null">All Tasks</option>
              @for (sprint of sprints; track sprint.id) {
                <option [ngValue]="sprint.id">{{ sprint.name }}</option>
              }
            </select>
          }
          <button class="btn btn-primary" (click)="showCreateTask = true">
            <span class="material-icons">add</span> New Task
          </button>
        </div>
      </div>

      <div class="board">
        @for (col of columns; track col.value) {
          <div class="column"
               (dragover)="onDragOver($event)"
               (drop)="onDrop($event, col.value)">
            <div class="column-header">
              <span class="column-title">{{ col.label }}</span>
              <span class="column-count">{{ getTasksByStatus(col.value).length }}</span>
            </div>
            <div class="column-body">
              @for (task of getTasksByStatus(col.value); track task.id) {
                <div class="task-card card"
                     draggable="true"
                     (dragstart)="onDragStart($event, task)"
                     (dragend)="onDragEnd()">
                  <div class="task-card-header">
                    <span class="badge badge-priority-{{ task.priority }}">{{ task.priority }}</span>
                    @if (task.storyPoints) {
                      <span class="story-points">{{ task.storyPoints }}</span>
                    }
                  </div>
                  <a [routerLink]="['/tasks', task.id]" class="task-card-title">{{ task.title }}</a>
                  @if (task.labels.length > 0) {
                    <div class="task-labels">
                      @for (label of task.labels; track label.id) {
                        <span class="task-label" [style.background]="label.color" [title]="label.name"></span>
                      }
                    </div>
                  }
                  <div class="task-card-footer">
                    <div class="task-assignees">
                      @for (assignee of task.assignees; track assignee.id) {
                        <span class="avatar avatar-sm" [title]="assignee.fullName">
                          {{ getInitials(assignee.fullName) }}
                        </span>
                      }
                    </div>
                    @if (task.commentCount > 0) {
                      <span class="comment-count">
                        <span class="material-icons">chat_bubble_outline</span>{{ task.commentCount }}
                      </span>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>

      <!-- Create Task Modal -->
      @if (showCreateTask) {
        <div class="modal-backdrop" (click)="showCreateTask = false">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>New Task</h2>
              <button class="btn btn-outline btn-sm" (click)="showCreateTask = false">
                <span class="material-icons">close</span>
              </button>
            </div>
            <form (ngSubmit)="createTask()">
              <div class="form-group">
                <label>Title</label>
                <input name="title" [(ngModel)]="newTask.title" required>
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea name="description" [(ngModel)]="newTask.description"></textarea>
              </div>
              <div class="grid grid-2">
                <div class="form-group">
                  <label>Priority</label>
                  <select name="priority" [(ngModel)]="newTask.priority" required>
                    @for (p of priorities; track p.value) {
                      <option [value]="p.value">{{ p.label }}</option>
                    }
                  </select>
                </div>
                <div class="form-group">
                  <label>Story Points</label>
                  <input name="storyPoints" type="number" [(ngModel)]="newTask.storyPoints" min="0">
                </div>
              </div>
              <div class="form-group">
                <label>Sprint</label>
                <select name="sprintId" [(ngModel)]="newTask.sprintId">
                  <option [ngValue]="undefined">Backlog (no sprint)</option>
                  @for (sprint of sprints; track sprint.id) {
                    <option [ngValue]="sprint.id">{{ sprint.name }}</option>
                  }
                </select>
              </div>
              <div class="form-group">
                <label>Assignees</label>
                <div class="member-checkboxes">
                  @for (member of members; track member.id) {
                    <label class="checkbox-label">
                      <input type="checkbox"
                             [checked]="selectedAssigneeIds.has(member.id)"
                             (change)="toggleAssignee(member.id)">
                      {{ member.fullName }}
                      <span class="member-role">{{ member.role }}</span>
                    </label>
                  }
                </div>
              </div>
              <div class="modal-actions">
                <button type="button" class="btn btn-outline" (click)="showCreateTask = false">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="!newTask.title || !newTask.priority">Create</button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .board-container { padding: 16px 24px; height: calc(100vh - 56px); display: flex; flex-direction: column; }
    .board-header {
      display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;
      h1 { font-size: 20px; font-weight: 700; }
      .badge { margin-left: 10px; }
    }
    .board-actions { display: flex; gap: 10px; align-items: center; }
    .sprint-select {
      padding: 6px 10px; border: 1px solid var(--border); border-radius: var(--radius);
      font-size: 14px; background: var(--surface);
    }
    .board {
      flex: 1; display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px;
    }
    .column {
      flex: 0 0 280px; display: flex; flex-direction: column;
      background: var(--bg); border-radius: var(--radius); padding: 8px;
    }
    .column-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 8px 10px; margin-bottom: 8px;
    }
    .column-title { font-size: 13px; font-weight: 600; text-transform: uppercase; color: var(--text-secondary); }
    .column-count {
      font-size: 12px; font-weight: 600; background: var(--border); color: var(--text-secondary);
      width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    }
    .column-body {
      flex: 1; display: flex; flex-direction: column; gap: 8px; overflow-y: auto;
      min-height: 60px;
    }
    .task-card {
      padding: 12px;
      cursor: grab;
      transition: box-shadow 0.15s, transform 0.1s;
      &:hover { box-shadow: var(--shadow-md); }
      &:active { cursor: grabbing; }
    }
    .task-card-header {
      display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;
    }
    .task-card-title {
      display: block; font-size: 14px; font-weight: 500; color: var(--text);
      text-decoration: none; margin-bottom: 8px;
      &:hover { color: var(--primary); }
    }
    .story-points {
      font-size: 11px; font-weight: 700; background: var(--bg); color: var(--text-secondary);
      width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    }
    .task-labels { display: flex; gap: 3px; margin-bottom: 8px; }
    .task-label { width: 24px; height: 4px; border-radius: 2px; }
    .task-card-footer {
      display: flex; align-items: center; justify-content: space-between;
    }
    .task-assignees { display: flex; gap: -4px; }
    .comment-count {
      display: flex; align-items: center; gap: 2px; font-size: 12px; color: var(--text-muted);
      .material-icons { font-size: 14px; }
    }
    .member-checkboxes { display: flex; flex-direction: column; gap: 6px; }
    .checkbox-label {
      display: flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer;
      input { cursor: pointer; }
    }
    .member-role { font-size: 12px; color: var(--text-muted); margin-left: auto; }
  `],
})
export class KanbanBoardComponent implements OnInit {
  columns = TASK_STATUSES;
  priorities = PRIORITIES;
  tasks: TaskDto[] = [];
  sprints: SprintDto[] = [];
  labels: LabelDto[] = [];
  members: UserDto[] = [];
  selectedAssigneeIds = new Set<number>();
  currentSprint: SprintDto | null = null;
  selectedSprintId: number | null = null;
  showCreateTask = false;
  draggedTask: TaskDto | null = null;

  projectId!: number;

  newTask: Partial<CreateTaskRequest> & { description?: string } = {
    title: '',
    description: '',
    priority: 'MEDIUM' as Priority,
    storyPoints: undefined,
    sprintId: undefined,
  };

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private sprintService: SprintService,
    private labelService: LabelService,
    private projectService: ProjectService,
  ) {}

  ngOnInit() {
    this.projectId = Number(this.route.snapshot.paramMap.get('projectId'));
    const sprintId = this.route.snapshot.paramMap.get('sprintId');

    this.sprintService.getByProject(this.projectId).subscribe(sprints => {
      this.sprints = sprints;
      if (sprintId) {
        this.selectedSprintId = Number(sprintId);
        this.currentSprint = sprints.find(s => s.id === this.selectedSprintId) || null;
      }
    });

    this.labelService.getByProject(this.projectId).subscribe(l => this.labels = l);
    this.projectService.getMembers(this.projectId).subscribe(m => this.members = m);
    this.loadTasks();
  }

  loadTasks() {
    if (this.selectedSprintId) {
      this.taskService.getBySprint(this.selectedSprintId).subscribe(t => this.tasks = t);
    } else {
      this.taskService.getByProject(this.projectId).subscribe(t => this.tasks = t);
    }
  }

  onSprintChange() {
    this.currentSprint = this.sprints.find(s => s.id === this.selectedSprintId) || null;
    this.loadTasks();
  }

  getTasksByStatus(status: TaskStatus): TaskDto[] {
    return this.tasks.filter(t => t.status === status);
  }

  onDragStart(event: DragEvent, task: TaskDto) {
    this.draggedTask = task;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(task.id));
    }
  }

  onDragEnd() {
    this.draggedTask = null;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDrop(event: DragEvent, newStatus: TaskStatus) {
    event.preventDefault();
    if (this.draggedTask && this.draggedTask.status !== newStatus) {
      const task = this.draggedTask;
      task.status = newStatus;
      this.taskService.updateStatus(task.id, { status: newStatus }).subscribe({
        error: () => this.loadTasks(),
      });
    }
    this.draggedTask = null;
  }

  toggleAssignee(userId: number) {
    if (this.selectedAssigneeIds.has(userId)) {
      this.selectedAssigneeIds.delete(userId);
    } else {
      this.selectedAssigneeIds.add(userId);
    }
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  createTask() {
    const request: CreateTaskRequest = {
      title: this.newTask.title!,
      description: this.newTask.description,
      priority: this.newTask.priority as Priority,
      storyPoints: this.newTask.storyPoints,
      sprintId: this.newTask.sprintId || this.selectedSprintId || undefined,
      projectId: this.projectId,
      assigneeIds: this.selectedAssigneeIds.size > 0 ? Array.from(this.selectedAssigneeIds) : undefined,
    };
    this.taskService.create(request).subscribe(() => {
      this.showCreateTask = false;
      this.newTask = { title: '', description: '', priority: 'MEDIUM', storyPoints: undefined, sprintId: undefined };
      this.selectedAssigneeIds.clear();
      this.loadTasks();
    });
  }
}
