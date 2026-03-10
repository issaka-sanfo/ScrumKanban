import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./auth/register.component').then(m => m.RegisterComponent) },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'projects', loadComponent: () => import('./projects/project-list.component').then(m => m.ProjectListComponent) },
      { path: 'projects/:id', loadComponent: () => import('./projects/project-detail.component').then(m => m.ProjectDetailComponent) },
      { path: 'projects/:projectId/board', loadComponent: () => import('./kanban-board/kanban-board.component').then(m => m.KanbanBoardComponent) },
      { path: 'projects/:projectId/board/:sprintId', loadComponent: () => import('./kanban-board/kanban-board.component').then(m => m.KanbanBoardComponent) },
      { path: 'tasks/:id', loadComponent: () => import('./tasks/task-detail.component').then(m => m.TaskDetailComponent) },
    ],
  },
  { path: '**', redirectTo: '' },
];
