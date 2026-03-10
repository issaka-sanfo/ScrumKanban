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
            <div class="assignee-dropdown" [class.open]="editingAssignees">
              <div class="dropdown-trigger" (click)="editingAssignees ? null : startEditAssignees()">
                <div class="selected-chips">
                  @for (assignee of task.assignees; track assignee.id) {
                    <span class="chip">
                      <span class="avatar avatar-xs">{{ getInitials(assignee.fullName) }}</span>
                      {{ assignee.fullName }}
                      @if (editingAssignees) {
                        <span class="chip-remove" (click)="toggleAssignee(assignee.id); $event.stopPropagation()">×</span>
                      }
                    </span>
                  }
                  @if (task.assignees.length === 0) {
                    <span class="dropdown-placeholder">Click to assign...</span>
                  }
                </div>
                @if (!editingAssignees) {
                  <span class="material-icons dropdown-arrow">expand_more</span>
                }
              </div>
              @if (editingAssignees) {
                <div class="dropdown-menu">
                  <input class="dropdown-search" placeholder="Search members..." [(ngModel)]="assigneeSearch" [ngModelOptions]="{standalone: true}">
                  @for (member of filteredMembers; track member.id) {
                    <div class="dropdown-item" [class.selected]="assigneeIds.has(member.id)" (click)="toggleAssignee(member.id)">
                      <span class="avatar avatar-sm">{{ getInitials(member.fullName) }}</span>
                      <span class="dropdown-item-name">{{ member.fullName }}</span>
                      <span class="member-role">{{ member.role }}</span>
                      @if (assigneeIds.has(member.id)) {
                        <span class="material-icons check-icon">check</span>
                      }
                    </div>
                  }
                  @if (filteredMembers.length === 0) {
                    <div class="dropdown-empty">No members found</div>
                  }
                </div>
                <div class="inline-actions" style="margin-top:6px">
                  <button class="btn btn-primary btn-sm" (click)="saveAssignees()">Save</button>
                  <button class="btn btn-outline btn-sm" (click)="editingAssignees = false">Cancel</button>
                </div>
              }
            </div>
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
    .assignee-dropdown { position: relative; }
    .dropdown-trigger {
      display: flex; align-items: center; justify-content: space-between;
      min-height: 36px; padding: 4px 8px; border: 1px solid var(--border);
      border-radius: var(--radius); cursor: pointer; background: var(--surface);
      &:hover { border-color: var(--primary); }
    }
    .assignee-dropdown.open .dropdown-trigger { border-color: var(--primary); box-shadow: 0 0 0 2px rgba(99,102,241,0.15); }
    .selected-chips { display: flex; flex-wrap: wrap; gap: 4px; flex: 1; }
    .chip {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 2px 8px; background: var(--primary); color: #fff;
      border-radius: 12px; font-size: 12px; font-weight: 500;
    }
    .chip-remove { cursor: pointer; font-size: 14px; line-height: 1; opacity: 0.8; &:hover { opacity: 1; } }
    .avatar-xs { width: 18px; height: 18px; font-size: 8px; }
    .dropdown-placeholder { color: var(--text-muted); font-size: 13px; padding: 2px 0; }
    .dropdown-arrow { font-size: 20px; color: var(--text-muted); }
    .dropdown-menu {
      position: absolute; top: 100%; left: 0; right: 0; z-index: 50;
      margin-top: 4px; background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); box-shadow: var(--shadow-md); max-height: 180px; overflow-y: auto;
    }
    .dropdown-search {
      width: 100%; padding: 8px 10px; border: none; border-bottom: 1px solid var(--border);
      font-size: 13px; outline: none; background: transparent;
    }
    .dropdown-item {
      display: flex; align-items: center; gap: 8px; padding: 8px 10px;
      cursor: pointer; font-size: 13px;
      &:hover { background: var(--bg); }
      &.selected { background: rgba(99,102,241,0.08); }
    }
    .dropdown-item-name { flex: 1; }
    .member-role { font-size: 11px; color: var(--text-muted); }
    .check-icon { font-size: 16px; color: var(--primary); }
    .dropdown-empty { padding: 12px; text-align: center; color: var(--text-muted); font-size: 13px; }
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
  assigneeSearch = '';

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

  get filteredMembers(): UserDto[] {
    if (!this.assigneeSearch.trim()) return this.members;
    const q = this.assigneeSearch.toLowerCase();
    return this.members.filter(m => m.fullName.toLowerCase().includes(q) || m.role.toLowerCase().includes(q));
  }

  startEditAssignees() {
    this.editingAssignees = true;
    this.assigneeIds = new Set(this.task!.assignees.map(a => a.id));
    this.assigneeSearch = '';
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
