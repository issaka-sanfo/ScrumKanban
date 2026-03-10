import { UserDto } from './auth.model';
import { LabelDto } from './label.model';

export interface TaskDto {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  storyPoints: number;
  sprintId: number;
  projectId: number;
  reporterId: number;
  reporterName: string;
  assignees: UserDto[];
  labels: LabelDto[];
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: Priority;
  storyPoints?: number;
  sprintId?: number;
  projectId: number;
  assigneeIds?: number[];
  labelIds?: number[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: Priority;
  storyPoints?: number;
  sprintId?: number;
  assigneeIds?: number[];
  labelIds?: number[];
}

export interface UpdateTaskStatusRequest {
  status: TaskStatus;
}

export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'CODE_REVIEW' | 'TESTING' | 'DONE';
export type Priority = 'LOWEST' | 'LOW' | 'MEDIUM' | 'HIGH' | 'HIGHEST';

export const TASK_STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'BACKLOG', label: 'Backlog' },
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'CODE_REVIEW', label: 'Code Review' },
  { value: 'TESTING', label: 'Testing' },
  { value: 'DONE', label: 'Done' },
];

export const PRIORITIES: { value: Priority; label: string }[] = [
  { value: 'HIGHEST', label: 'Highest' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
  { value: 'LOWEST', label: 'Lowest' },
];
