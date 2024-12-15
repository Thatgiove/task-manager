import { createAction, props } from '@ngrx/store';
import { Task } from '../tasks/models/task.model';
import { Board } from '../tasks/models/board.model';

export const loadBoards = createAction(
  'GET "boards" - Load Boards',
  props<{ boards: Board[] }>()
);

export const deleteTask = createAction(
  '[Task] Delete Task',
  props<{ taskId: number; boardId: number }>() 
);
export const deleteTaskSuccess = createAction(
  '[Task] Delete Task Success',
  props<{ taskId: number; boardId: number }>()
);

export const addTask = createAction(
  '[Boards] Add Task',
  props<{ task: Task }>()
);
export const addTaskSuccess = createAction(
  '[Task] Add Task Success',
  props<{ task: Task }>()
);

export const setTaskEditMode = createAction(
  '[Task] Set Edit Mode',
  props<{ boardId: number; taskId?: number; editMode: boolean }>()
);

export const updateTask = createAction(
  '[Task] Update Task',
  props<{ task: Task }>()
);

export const updateTaskSuccess = createAction(
  '[Task] Update Task Success',
  props<{ task: Task }>()
);

export const moveTask = createAction(
  '[Task] Move Task',
  props<{ taskId: number; boardId: number }>()
);

export const moveTaskSuccess = createAction(
  '[Task] Move Task Success',
  props<{ taskId: number; boardId: number }>()
);