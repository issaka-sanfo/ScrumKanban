import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from '../core/services/task.service';
import { CommentService } from '../core/services/comment.service';
import { ProjectService } from '../core/services/project.service';
import { TaskDto, TASK_STATUSES, PRIORITIES, TaskStatus, Priority } from '../core/models/task.model';
import { CommentDto } from '../core/models/comment.model';
import { UserDto } from '../core/models/auth.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container" *ngIf="task">
      <div class="task-layout">
        <div class="task-main">
          <div class="page-header">
            <a [routerLink]="['/projects', task.projectId, 'board']" class="back-link">
              <span class="material-icons">arrow_back</span> Back to Board
            </a>
          </div>

          <!-- Title (editable) -->
          @if (editing) {
            <input class="title-input" [(ngModel)]="editTitle" (blur)="saveTitle()" (keyup.enter)="saveTitle()">
          } @else {
            <h1 class="task-title" (click)="startEditTitle()">{{ task.title }}</h1>
          }

          <!-- Description -->
          <div class="section">
            <h3>Description</h3>
            @if (editingDesc) {
              <div>
                <textarea class="desc-input" [(ngModel)]="editDescription" rows="4"></textarea>
                <div class="inline-actions">
                  <button class="btn btn-primary btn-sm" (click)="saveDescription()">Save</button>
                  <button class="btn btn-outline btn-sm" (click)="editingDesc = false">Cancel</button>
                </div>
              </div>
            } @else {
              <p class="description-text" (click)="startEditDesc()">
                {{ task.description || 'Click to add a description...' }}
              </p>
            }
          </div>

          <!-- Comments -->
          <div class="section">
            <h3>Comments ({{ comments.length }})</h3>
            <form class="comment-form" (ngSubmit)="addComment()">
              <textarea name="commentContent" [(ngModel)]="newComment" placeholder="Write a comment..." rows="2"></textarea>
              <button class="btn btn-primary btn-sm" type="submit" [disabled]="!newComment.trim()">Comment</button>
            </form>
            <div class="comment-list">
              @for (comment of comments; track comment.id) {
                <div class="comment">
                  <div class="comment-header">
                    <span class="avatar avatar-sm">{{ getInitials(comment.authorName) }}</span>
                    <strong>{{ comment.authorName }}</strong>
                    <span class="comment-date">{{ comment.createdAt | date:'medium' }}</span>
                  </div>
                  <p class="comment-body">{{ comment.content }}</p>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="task-sidebar">
          <div class="sidebar-section">
            <label>Status</label>
            <select [(ngModel)]="task.status" (ngModelChange)="updateStatus($event)">
              @for (s of statuses; track s.value) {
                <option [value]="s.value">{{ s.label }}</option>
              }
            </select>
          </div>

          <div class="sidebar-section">
            <label>Priority</label>
            <select [(ngModel)]="task.priority" (ngModelChange)="updatePriority($event)">
              @for (p of priorities; track p.value) {
                <option [value]="p.value">{{ p.label }}</option>
              }
            </select>
          </div>

          <div class="sidebar-section">
            <label>Story Points</label>
            <input type="number" [(ngModel)]="task.storyPoints" (change)="updateField()" min="0">
          </div>

          <div class="sidebar-section">
            <label>Assignees</label>
            @if (editingAssignees) {
              <div class="member-checkboxes">
                @for (member of members; track member.id) {
                  <label class="checkbox-label">
                    <input type="checkbox"
                           [checked]="assigneeIds.has(member.id)"
                           (change)="toggleAssignee(member.id)">
                    {{ member.fullName }}
                  </label>
                }
                <div class="inline-actions">
                  <button class="btn btn-primary btn-sm" (click)="saveAssignees()">Save</button>
                  <button class="btn btn-outline btn-sm" (click)="editingAssignees = false">Cancel</button>
                </div>
              </div>
            } @else {
              <div class="assignee-list">
                @for (assignee of task.assignees; track assignee.id) {
                  <div class="assignee-item">
                    <span class="avatar avatar-sm">{{ getInitials(assignee.fullName) }}</span>
                    <span>{{ assignee.fullName }}</span>
                  </div>
                }
                @if (task.assignees.length === 0) {
                  <span class="text-muted">Unassigned</span>
                }
                <button class="btn btn-outline btn-sm" style="margin-top:6px" (click)="startEditAssignees()">
                  <span class="material-icons" style="font-size:14px">edit</span> Edit
                </button>
              </div>
            }
          </div>

          <div class="sidebar-section">
            <label>Labels</label>
            <div class="label-list">
              @for (label of task.labels; track label.id) {
                <span class="label-tag" [style.background]="label.color + '22'" [style.color]="label.color">
                  {{ label.name }}
                </span>
              }
              @if (task.labels.length === 0) {
                <span class="text-muted">No labels</span>
              }
            </div>
          </div>

          <div class="sidebar-section">
            <label>Reporter</label>
            <span>{{ task.reporterName }}</span>
          </div>

          <div class="sidebar-section">
            <label>Created</label>
            <span>{{ task.createdAt | date:'mediumDate' }}</span>
          </div>

          <hr>

          <button class="btn btn-danger btn-sm" (click)="deleteTask()">
            <span class="material-icons">delete</span> Delete Task
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .task-layout { display: grid; grid-template-columns: 1fr 280px; gap: 32px; }
    .back-link {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 14px; color: var(--text-secondary); text-decoration: none;
      &:hover { color: var(--primary); }
      .material-icons { font-size: 18px; }
    }
    .task-title {
      font-size: 24px; font-weight: 700; margin: 12px 0 24px;
      cursor: pointer; padding: 4px 0;
      &:hover { color: var(--primary); }
    }
    .title-input {
      font-size: 24px; font-weight: 700; width: 100%; border: 2px solid var(--primary);
      border-radius: var(--radius); padding: 4px 8px; margin: 12px 0 24px;
      font-family: inherit;
    }
    .section { margin-bottom: 28px;
      h3 { font-size: 15px; font-weight: 600; margin-bottom: 10px; color: var(--text-secondary); }
    }
    .description-text {
      font-size: 14px; line-height: 1.7; cursor: pointer; padding: 8px;
      border-radius: var(--radius); color: var(--text);
      &:hover { background: var(--bg); }
    }
    .desc-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border); border-radius: var(--radius); font-family: inherit; font-size: 14px; }
    .inline-actions { display: flex; gap: 6px; margin-top: 8px; }
    .comment-form {
      margin-bottom: 16px;
      textarea { width: 100%; padding: 8px 12px; border: 1px solid var(--border); border-radius: var(--radius); font-family: inherit; font-size: 14px; margin-bottom: 6px; }
    }
    .comment-list { display: flex; flex-direction: column; gap: 12px; }
    .comment { padding: 12px; background: var(--bg); border-radius: var(--radius); }
    .comment-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; font-size: 14px; }
    .comment-date { font-size: 12px; color: var(--text-muted); margin-left: auto; }
    .comment-body { font-size: 14px; line-height: 1.6; }

    .task-sidebar {
      background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
      padding: 20px; height: fit-content;
    }
    .sidebar-section {
      margin-bottom: 16px;
      label { display: block; font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px; }
      select, input { width: 100%; padding: 6px 8px; border: 1px solid var(--border); border-radius: var(--radius); font-size: 14px; }
      span { font-size: 14px; }
    }
    .text-muted { color: var(--text-muted); font-size: 13px; }
    .assignee-list { display: flex; flex-direction: column; gap: 6px; }
    .assignee-item { display: flex; align-items: center; gap: 8px; font-size: 14px; }
    .member-checkboxes { display: flex; flex-direction: column; gap: 6px; }
    .checkbox-label {
      display: flex; align-items: center; gap: 6px; font-size: 13px; cursor: pointer;
      input { cursor: pointer; }
    }
    .label-list { display: flex; flex-wrap: wrap; gap: 4px; }
    .label-tag { padding: 2px 8px; border-radius: 10px; font-size: 12px; font-weight: 500; }
    hr { border: none; border-top: 1px solid var(--border); margin: 16px 0; }

    @media (max-width: 768px) {
      .task-layout { grid-template-columns: 1fr; }
    }
  `],
})
export class TaskDetailComponent implements OnInit {
  task: TaskDto | null = null;
  comments: CommentDto[] = [];
  members: UserDto[] = [];
  statuses = TASK_STATUSES;
  priorities = PRIORITIES;
  newComment = '';
  editing = false;
  editTitle = '';
  editingDesc = false;
  editDescription = '';
  editingAssignees = false;
  assigneeIds = new Set<number>();

  private taskId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private commentService: CommentService,
    private projectService: ProjectService,
  ) {}

  ngOnInit() {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTask();
    this.loadComments();
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  loadTask() {
    this.taskService.getById(this.taskId).subscribe(t => {
      this.task = t;
      if (this.members.length === 0) {
        this.projectService.getMembers(t.projectId).subscribe(m => this.members = m);
      }
    });
  }

  loadComments() {
    this.commentService.getByTask(this.taskId).subscribe(c => this.comments = c);
  }

  startEditTitle() {
    this.editing = true;
    this.editTitle = this.task!.title;
  }

  saveTitle() {
    if (this.editTitle.trim() && this.editTitle !== this.task!.title) {
      this.taskService.update(this.taskId, { title: this.editTitle }).subscribe(t => {
        this.task = t;
      });
    }
    this.editing = false;
  }

  startEditDesc() {
    this.editingDesc = true;
    this.editDescription = this.task!.description || '';
  }

  saveDescription() {
    this.taskService.update(this.taskId, { description: this.editDescription }).subscribe(t => {
      this.task = t;
      this.editingDesc = false;
    });
  }

  updateStatus(status: TaskStatus) {
    this.taskService.updateStatus(this.taskId, { status }).subscribe(t => this.task = t);
  }

  updatePriority(priority: Priority) {
    this.taskService.update(this.taskId, { priority }).subscribe(t => this.task = t);
  }

  updateField() {
    if (this.task) {
      this.taskService.update(this.taskId, { storyPoints: this.task.storyPoints }).subscribe(t => this.task = t);
    }
  }

  addComment() {
    if (!this.newComment.trim()) return;
    this.commentService.create(this.taskId, { content: this.newComment }).subscribe(() => {
      this.newComment = '';
      this.loadComments();
      this.loadTask();
    });
  }

  startEditAssignees() {
    this.editingAssignees = true;
    this.assigneeIds = new Set(this.task!.assignees.map(a => a.id));
  }

  toggleAssignee(userId: number) {
    if (this.assigneeIds.has(userId)) {
      this.assigneeIds.delete(userId);
    } else {
      this.assigneeIds.add(userId);
    }
  }

  saveAssignees() {
    this.taskService.update(this.taskId, { assigneeIds: Array.from(this.assigneeIds) }).subscribe(t => {
      this.task = t;
      this.editingAssignees = false;
    });
  }

  deleteTask() {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.delete(this.taskId).subscribe(() => {
        this.router.navigate(['/projects', this.task!.projectId]);
      });
    }
  }
}
