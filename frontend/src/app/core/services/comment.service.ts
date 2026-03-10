import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { CommentDto, CreateCommentRequest } from '../models/comment.model';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getByTask(taskId: number) {
    return this.http.get<CommentDto[]>(`${this.apiUrl}/tasks/${taskId}/comments`);
  }

  create(taskId: number, request: CreateCommentRequest) {
    return this.http.post<CommentDto>(`${this.apiUrl}/tasks/${taskId}/comments`, request);
  }

  delete(taskId: number, commentId: number) {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${taskId}/comments/${commentId}`);
  }
}
