import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Task } from '../models/task.model';
import { addTask, deleteTask, loadBoards, moveTask, setTaskEditMode, updateTask } from '../../state/tasks.actions';
import { CommonModule } from '@angular/common';
import { BoardService } from '../board.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],

})
export class TaskListComponent implements OnInit {
  boards$
  taskForm: FormGroup;
  editingTask: { boardId: number; taskId: number | undefined } | null = null;

  constructor(private store: Store, private boardService: BoardService, private fb: FormBuilder) {
    this.boards$ = this.store.select((state: any) => state.boards.boards);
    this.taskForm = this.fb.group({
      title: [''],
      description: [''],
    });
  }


  ngOnInit(): void {
    this.boardService.getBoardsWithTasks().subscribe({
      next: (boards) => {
        this.store.dispatch(loadBoards({ boards })); // Aggiorna lo stato globale
      },
      error: (error) => {
        console.error('Errore nel caricamento delle boards', error);
      },
    });
  }

  cancel(boardId: number, task: Task) {
    this.editingTask = null;
    this.store.dispatch(setTaskEditMode({ boardId: boardId, taskId: task.id, editMode: false }));

    this.taskForm.setValue({
      title: task.title,
      description: task.description,
    });
  }

  setEditMode(boardId: number, task: Task) {
    this.editingTask = { boardId, taskId: task.id };

    this.store.dispatch(setTaskEditMode({ boardId: boardId, taskId: task.id, editMode: true }));

    this.taskForm.setValue({
      title: task.title,
      description: task.description,
    });
  }

  addTask() {
    const newTask: Task = {
      title: 'Nuovo task',
      description: 'Descrizione',
      boardId: 1
    };
    this.store.dispatch(addTask({ task: newTask }));
  }

  updateTaskTitleDescription() {
    if (this.taskForm.valid) {
      const { title, description } = this.taskForm.value;
      this.store.dispatch(
        updateTask({
          task: { id: this.editingTask?.taskId, title, description, boardId: this.editingTask?.boardId, editMode: false },
        })
      );
      this.editingTask = null;
    }
  }

  onDeleteTask(boardId: number, taskId: number) {
    this.store.dispatch(deleteTask({ boardId, taskId }));
  }

  moveTaskToBoard(taskId: number, boardId: number) {
    this.store.dispatch(moveTask({ taskId, boardId }));
  }
}


