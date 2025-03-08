import { BoardState, Task, TaskState } from "@/common/types";
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { create } from "zustand";
import { initialData, saveBoardDataLocally, uuidv4 } from "../utilities";

interface BoardStore {
  openAddModal: boolean | string;
  board: BoardState;
  activeId: UniqueIdentifier | null;
  taskEditData: undefined | Task;
  openDeleteModal: boolean;
  deleteData: Task | undefined;
  setOpenAddModal: (columnID: boolean | string) => void;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  setTaskEditData: (taskEditData: Task | undefined) => void;
  addNewTask: (columnId: string, addDetails: TaskState) => void;
  editTask: (columnId: string, taskId: string, editDetails: TaskState) => void;
  setOpenDeleteModel: (bool: boolean) => void;
  setDeleteData: (deleteData: Task | undefined) => void;
  deleteTask: (deleteData: Task) => void;
}
const loadBoardState = (): BoardState => {
  const storedBoard = localStorage.getItem("boardState");
  return storedBoard ? JSON.parse(storedBoard) : initialData;
};

export const useBoardStore = create<BoardStore>((set) => ({
  openAddModal: false,
  board: loadBoardState(),
  activeId: null,
  taskEditData: undefined,
  openDeleteModal: false,
  deleteData: undefined,
  setTaskEditData: (taskEditData) => {
    set({ taskEditData });
  },
  setOpenAddModal: (columnID) => {
    set({ openAddModal: columnID });
  },
  handleDragStart: (event) => {
    const { active } = event;
    set({ activeId: active.id });
  },
  handleDragOver: (event) => {
    setTimeout(
      () =>
        set((state) => {
          const { active, over } = event;
          if (!over) return state;

          const activeId = active.id;
          const overId = over.id;
          if (activeId === overId) return state;

          const activeData = active.data.current;
          const overData = over.data.current;

          const isActiveATask = activeData?.type === "Task";
          const isOverATask = overData?.type === "Task";

          if (!isActiveATask) return state;

          const newBoard = structuredClone(state.board);
          const { tasks, columns } = newBoard;

          const activeTask = tasks[activeId];
          const activeColumn = columns[activeTask.columnId];

          if (!activeTask || !activeColumn) return state; // Safety check

          if (isOverATask) {
            const overTask = tasks[overId];

            const overColumn = columns[overTask.columnId];

            if (!overTask || !overColumn) return state; // Safety check

            const activeIndex = activeColumn.taskIds.indexOf(
              activeId as string
            );
            const overIndex = overColumn.taskIds.indexOf(overId as string);
            // Moving between different columns
            if (activeTask.columnId !== overTask.columnId) {
              activeColumn.taskIds = activeColumn.taskIds.filter(
                (id) => id !== activeId
              );
              overColumn.taskIds.splice(overIndex, 0, activeId as string); // Insert at correct position

              activeTask.columnId = overTask.columnId; // Update task's columnId
            } else {
              // Reordering within the same column
              activeColumn.taskIds = arrayMove(
                activeColumn.taskIds,
                activeIndex,
                overIndex
              );
            }
          }

          const isOverAColumn = overData?.type === "Column";
          if (isOverAColumn) {
            const overColumn = columns[overId];

            // Remove from current column
            activeColumn.taskIds = activeColumn.taskIds.filter(
              (id) => id !== activeId
            );
            // Add to new column at the end
            overColumn.taskIds.push(activeId as string);

            // Update task's columnId
            activeTask.columnId = overId as string;
          }
          saveBoardDataLocally(newBoard);
          return { ...state, board: newBoard };
        }),
      0
    );
  },
  handleDragEnd: (event) => {
    set((state) => {
      const { active, over } = event;
      if (!over) return state;

      const activeId = active.id;
      const overId = over.id;
      if (activeId === overId) return state;

      const activeData = active.data.current;
      const isActiveAColumn = activeData?.type === "Column";
      if (isActiveAColumn) {
        const newBoard = structuredClone(state.board);
        const { columns } = newBoard;
        const activeColumn = columns[activeId];
        const overColumn = columns[overId];

        if (!activeColumn || !overColumn) return state; // Safety check

        // Get the entries of columns to reorder them
        const columnEntries = Object.entries(columns);
        const activeIndex = columnEntries.findIndex(
          ([key]) => key === activeId
        );
        const overIndex = columnEntries.findIndex(([key]) => key === overId);

        if (activeIndex === -1 || overIndex === -1) return state; // Safety check

        // Reorder logic without breaking array structure
        const reorderedEntries = [...columnEntries];
        const [movedItem] = reorderedEntries.splice(activeIndex, 1);
        reorderedEntries.splice(overIndex, 0, movedItem);

        // Convert back to an object
        newBoard.columns = Object.fromEntries(reorderedEntries);
        saveBoardDataLocally(newBoard);
        return { ...state, board: newBoard };
      }
      return state;
    });
  },
  addNewTask: (columnId, addDetails) => {
    const newTaskId = "task-" + uuidv4();
    const newTask: Task = {
      id: newTaskId,
      columnId,
      title: addDetails.title,
      description: addDetails.description,
      branchName: addDetails.branchName,
    };
    set((state) => {
      const newBoard = structuredClone(state.board);
      newBoard.tasks[newTaskId] = newTask;
      const newTaskIds = [...newBoard?.columns[columnId]?.taskIds];
      newTaskIds.unshift(newTaskId);
      newBoard.columns[columnId].taskIds = newTaskIds;
      saveBoardDataLocally(newBoard);
      return { ...state, openAddModal: false, board: newBoard };
    });
  },
  editTask: (columnId, taskId, editDetails) => {
    set((state) => {
      const newBoard = structuredClone(state.board);
      newBoard.tasks[taskId] = { ...newBoard.tasks[taskId], ...editDetails };
      saveBoardDataLocally(newBoard);
      return { ...state, openAddModal: false, board: newBoard };
    });
  },
  setOpenDeleteModel: (bool) => {
    set({ openDeleteModal: bool });
  },
  setDeleteData: (deleteData) => {
    set({ deleteData });
  },
  deleteTask: (deleteData) => {
    set((state) => {
      const newBoard = structuredClone(state.board);
      delete newBoard.tasks[deleteData.id];
      newBoard.columns[deleteData.columnId].taskIds = newBoard.columns[
        deleteData.columnId
      ].taskIds.filter((id) => id !== deleteData.id);
      saveBoardDataLocally(newBoard);
      return { ...state, openDeleteModal: false, board: newBoard };
    });
  },
}));
