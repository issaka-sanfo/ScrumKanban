export interface CommentDto {
  id: number;
  content: string;
  taskId: number;
  authorId: number;
  authorName: string;
  createdAt: string;
}

export interface CreateCommentRequest {
  content: string;
}
