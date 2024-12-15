import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListComponent } from './task-list.component';
import { Task } from '../models/task.model';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BoardService } from '../board.service';
import { provideStore } from '@ngrx/store';
import { boardsReducer } from '../../state/tasks.reducer';
import { provideHttpClient } from '@angular/common/http';


describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  let service: BoardService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [provideHttpClient(),provideHttpClientTesting() , BoardService, provideStore({ boards: boardsReducer })]
    })
    .compileComponents();

    service = TestBed.inject(BoardService);
    httpMock = TestBed.inject(HttpTestingController); 

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new task', () => {
    const newTask: Task = { id: 0, title: 'New Task', description: 'Description', boardId: 1 };
    const mockResponse: Task = { id: 123, title: 'New Task', description: 'Description', boardId: 1 };

    service.addTask(newTask).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/tasks`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);

    req.flush(mockResponse);
  });
});
