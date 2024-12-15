import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskListComponent } from './tasks/task-list/task-list.component';
import { StoreModule } from '@ngrx/store';
import { BoardService } from './tasks/board.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, StoreModule, NgFor, NgIf, HttpClientModule, TaskListComponent,],
  providers: [BoardService, HttpClient],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Task Manager';
}
