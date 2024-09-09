export interface Column {
  id: string;
  title: string;
  taskIds: string[];
  order: number;
  itemCount: number;
}

export interface Task {
  id: string;
  columnId: string;
  title: string;
  description: string;
  branchName?: string;
  order: number;
}

export interface BoardState {
  columns: Record<string, Column>;
  tasks: Record<string, Task>;
}
