export interface ProjectDto {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  ownerName: string;
  memberIds: number[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}
