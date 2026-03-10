export interface DashboardDto {
  totalProjects: number;
  activeSprintsCount: number;
  myTasksCount: number;
  sprintMetrics: SprintMetricsDto[];
}

export interface SprintMetricsDto {
  sprintId: number;
  sprintName: string;
  totalTasks: number;
  completedTasks: number;
  totalStoryPoints: number;
  completedStoryPoints: number;
  tasksByStatus: Record<string, number>;
}
