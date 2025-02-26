export interface Column {
  id: string;
  title: string;
  taskIds: string[];
  itemCount: number;
}

export interface Task {
  id: string;
  columnId: string;
  title: string;
  description: string;
  branchName?: string;
}

export interface TaskState {
  title: string;
  description: string;
  branchName?: string;
}
export interface BoardState {
  columns: Record<string, Column>;
  tasks: Record<string, Task>;
}
