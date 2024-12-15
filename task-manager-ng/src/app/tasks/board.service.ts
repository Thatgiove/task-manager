import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './models/task.model';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getBoardsWithTasks(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/boards`);
  }

  createTask(task : Task): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/tasks`, task );
  }  
  
  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, task);
  }

  deleteTask(taskId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/tasks/${taskId}`);
  }

  updateTask(task : Task): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/tasks`, task);
  }

  moveTask(taskId: number, boardId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/tasks/${taskId}/move`, { boardId });
  }
}
