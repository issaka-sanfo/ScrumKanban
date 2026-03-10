export interface SprintDto {
  id: number;
  name: string;
  goal: string;
  projectId: number;
  startDate: string;
  endDate: string;
  status: SprintStatus;
  createdAt: string;
}

export interface CreateSprintRequest {
  name: string;
  goal?: string;
  startDate: string;
  endDate: string;
}

export type SprintStatus = 'PLANNING' | 'ACTIVE' | 'COMPLETED';
