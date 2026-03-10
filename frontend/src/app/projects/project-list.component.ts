import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../core/services/project.service';
import { ProjectDto } from '../core/models/project.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Projects</h1>
        <button class="btn btn-primary" (click)="showCreate = true">
          <span class="material-icons">add</span> New Project
        </button>
      </div>

      @if (projects.length === 0) {
        <div class="empty-state">
          <span class="material-icons">folder_off</span>
          <p>No projects yet. Create your first project to get started.</p>
        </div>
      } @else {
        <div class="grid grid-3">
          @for (project of projects; track project.id) {
            <a [routerLink]="['/projects', project.id]" class="card project-card">
              <h3>{{ project.name }}</h3>
              <p class="project-desc">{{ project.description || 'No description' }}</p>
              <div class="project-meta">
                <span><span class="material-icons">person</span> {{ project.ownerName }}</span>
                <span><span class="material-icons">group</span> {{ project.memberIds.length }} members</span>
              </div>
            </a>
          }
        </div>
      }

      @if (showCreate) {
        <div class="modal-backdrop" (click)="showCreate = false">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>New Project</h2>
              <button class="btn btn-outline btn-sm" (click)="showCreate = false">
                <span class="material-icons">close</span>
              </button>
            </div>
            <form (ngSubmit)="createProject()">
              <div class="form-group">
                <label for="name">Project Name</label>
                <input id="name" name="name" [(ngModel)]="newProject.name" required>
              </div>
              <div class="form-group">
                <label for="description">Description</label>
                <textarea id="description" name="description" [(ngModel)]="newProject.description"></textarea>
              </div>
              <div class="modal-actions">
                <button type="button" class="btn btn-outline" (click)="showCreate = false">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="!newProject.name">Create</button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .project-card {
      padding: 20px;
      text-decoration: none;
      color: var(--text);
      transition: box-shadow 0.15s, transform 0.15s;
      &:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
      h3 { font-size: 16px; margin-bottom: 6px; }
    }
    .project-desc {
      font-size: 14px;
      color: var(--text-secondary);
      margin-bottom: 16px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .project-meta {
      display: flex;
      gap: 16px;
      font-size: 13px;
      color: var(--text-muted);
      span {
        display: flex;
        align-items: center;
        gap: 4px;
        .material-icons { font-size: 16px; }
      }
    }
  `],
})
export class ProjectListComponent implements OnInit {
  projects: ProjectDto[] = [];
  showCreate = false;
  newProject = { name: '', description: '' };

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getMy().subscribe(p => this.projects = p);
  }

  createProject() {
    this.projectService.create(this.newProject).subscribe(() => {
      this.showCreate = false;
      this.newProject = { name: '', description: '' };
      this.loadProjects();
    });
  }
}
