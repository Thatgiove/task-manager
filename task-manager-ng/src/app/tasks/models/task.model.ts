export interface Task {
  id? : number;
  title: string;
  description: string;
  editMode? : boolean;
  boardId? : number
}