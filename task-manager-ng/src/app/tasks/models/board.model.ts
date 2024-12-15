import { Task } from "./task.model";

export interface Board {
    id: number;
    name: string;
    tasks : Task[];
  }