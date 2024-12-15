import { createReducer, on } from '@ngrx/store';
import { addTaskSuccess, deleteTaskSuccess, loadBoards, moveTaskSuccess, setTaskEditMode, updateTaskSuccess } from './tasks.actions';
import { Board } from '../tasks/models/board.model';

//creo global state
export interface BoardsState {
  boards: Board[];
}
export const initialState: BoardsState = {
  boards: [],
};


export const boardsReducer = createReducer(
  initialState,
  on(loadBoards, (state, { boards }) => ({
    ...state,
    boards: boards,
  })),
  on(deleteTaskSuccess, (state, { taskId, boardId }) => ({
    ...state,
    boards: state.boards.map((board) =>
      board.id === boardId
        ? {
          ...board,
          tasks: board.tasks.filter((task) => task.id !== taskId),
        }
        : board
    ),
  })),
  on(addTaskSuccess, (state, { task }) => {
    const updatedBoards = state.boards.map((board) => {
      if (board.id === task.boardId) {
        const updatedTasks = [...board.tasks, task];
        return {
          ...board,
          tasks: updatedTasks,
        };
      }
      return board;
    });

    return {
      ...state,
      boards: updatedBoards,
    };
  }),
  on(setTaskEditMode, (state, { boardId, taskId, editMode }) => ({
    ...state,
    boards: state.boards.map(board =>
      board.id === boardId
        ? {
          ...board,
          tasks: board.tasks.map(task =>
            task.id === taskId ? { ...task, editMode } : task
          ),
        }
        : board
    ),
  })),
  on(updateTaskSuccess, (state, { task }) => ({
    ...state,
    boards: state.boards.map(board =>
      board.id === task.boardId
        ? {
          ...board,
          tasks: board.tasks.map(t =>
            t.id === task.id
              ? { ...t, ...task }
              : t
          )
        }
        : board
    )
  })),
  on(moveTaskSuccess, (state, { taskId, boardId }) => {
    let taskToMove: any;
    const updatedBoards = state.boards.map((board) => {
      if (board.tasks.some((task) => task.id === taskId)) {
        // delete
        taskToMove = board.tasks.find((task) => task.id === taskId);
        return {
          ...board,
          tasks: board.tasks.filter((task) => task.id !== taskId),
        };
      }
      return board;
    });

    // add
    return {
      ...state,
      boards: updatedBoards.map((board) =>
        board.id === boardId
          ? {
            ...board,
            tasks: [...board.tasks, { ...taskToMove, boardId }],
          }
          : board
      ),
    };
  })
);