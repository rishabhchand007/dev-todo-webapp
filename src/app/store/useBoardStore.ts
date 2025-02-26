import { BoardState, Task } from "@/common/types";
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { create } from "zustand";

const initialDataLoad: BoardState = {
  columns: {
    column1: {
      id: "column1",
      title: "TODO",
      taskIds: ["task1", "task2"],
      itemCount: 2,
    },
    column2: {
      id: "column2",
      title: "IN WORK",
      taskIds: ["task3", "task4"],
      itemCount: 2,
    },
    column3: {
      id: "column3",
      title: "COMPLETED",
      taskIds: ["task5", "task6", "task7"],
      itemCount: 3,
    },
  },
  tasks: {
    task1: {
      id: "task1",
      columnId: "column1",
      title: "1 Copywriting of the app",
      description:
        "Composing words to provide people with decision-making clarity.",
      branchName: "copy-write-app",
    },
    task2: {
      id: "task2",
      columnId: "column1",
      title: "2 Add new dropdown in the forms",
      description: "Add, delete, remove and update options.",
      branchName: "feat-dropdown",
    },
    task3: {
      id: "task3",
      columnId: "column2",
      title: "3 Github Integration",
      description: "Processing in the backend",
    },
    task4: {
      id: "task4",
      columnId: "column2",
      title: "4 Remove Admin Panel Colors",
      description: "",
    },
    task5: {
      id: "task5",
      columnId: "column3",
      title: "4 Remove Admin Panel Colors",
      description: "4 Remove Admin Panel Colors",
      branchName: "copy-write-app",
    },
    task6: {
      id: "task6",
      columnId: "column3",
      title: "4 Remove Admin Panel Colors",
      description: "4 Remove Admin Panel Colors",
      branchName: "copy-write-app",
    },
    task7: {
      id: "task7",
      columnId: "column3",
      title: "4 Remove Admin Panel Colors",
      description: "4 Remove Admin Panel Colors",
      branchName: "copy-write-app",
    },
  },
};

interface BoardStore {
  board: BoardState;
  activeId: UniqueIdentifier | null;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  // moveTask: (taskId: string, toColumnId: string) => void;
  // removeTask: (taskId: string) => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
  board: initialDataLoad,
  activeId: null,
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
        return { ...state, board: newBoard };
      }
      return state;
    });
  },
}));
