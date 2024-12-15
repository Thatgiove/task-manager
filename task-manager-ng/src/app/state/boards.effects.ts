import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { BoardService } from '../tasks/board.service';
import { addTask, addTaskSuccess, deleteTask, deleteTaskSuccess, moveTask, moveTaskSuccess, updateTask, updateTaskSuccess } from './tasks.actions';
import { of } from 'rxjs';

@Injectable()
export class BoardsEffects {
  constructor(private boardService: BoardService) { }

  addTask$ = createEffect(() =>
    inject(Actions).pipe(
      ofType(addTask),
      mergeMap(({ task }) => {

        return this.boardService.addTask(task).pipe(
          map((newTask) => {
            console.log(newTask)
            return addTaskSuccess({ task: newTask });
          }),
          catchError((error) => {
            return of({ type: '[Task] Add Task Failed' });
          })
        );
      })
    )
  );

  updateTask$ = createEffect(() =>
    inject(Actions).pipe(
      ofType(updateTask),
      mergeMap(({ task }) => {

        return this.boardService.updateTask(task).pipe(
          map(() => {
            return updateTaskSuccess({ task: task });
          }),
          catchError(() => {
            return of({ type: '[Task] Update Task Failed' });
          })
        );
      })
    )
  );

  deleteTask$ = createEffect(() =>
    inject(Actions).pipe(
      ofType(deleteTask),
      mergeMap(({ taskId, boardId }) =>
        this.boardService.deleteTask(taskId).pipe(
          map(() => deleteTaskSuccess({ taskId, boardId })),
          catchError(() => {
            return of({ type: '[Task] Delete Task Failed' });
          })
        )
      )
    )
  );

  moveTask$ = createEffect(() =>
    inject(Actions).pipe(
      ofType(moveTask),
      mergeMap(({ taskId, boardId }) =>
        this.boardService.moveTask(taskId, boardId).pipe(
          map(() => moveTaskSuccess({ taskId, boardId })),
          catchError(() => {
            return of({ type: '[Task] Move Task Failed' });
          })
        )
      )
    )
  );
}

