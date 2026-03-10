export interface LabelDto {
  id: number;
  name: string;
  color: string;
  projectId: number;
}

export interface CreateLabelRequest {
  name: string;
  color: string;
}
