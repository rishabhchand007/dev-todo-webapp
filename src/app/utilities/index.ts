import { BoardState } from "@/common/types";

export function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
}

export const initialData: BoardState = {
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
      priority: "medium",
    },
    task2: {
      id: "task2",
      columnId: "column1",
      title: "2 Add new dropdown in the forms",
      description: "Add, delete, remove and update options.",
      branchName: "feat-dropdown",
      priority: "high",
    },
    task3: {
      id: "task3",
      columnId: "column2",
      title: "3 Github Integration",
      description: "Processing in the backend",
      priority: "medium",
    },
    task4: {
      id: "task4",
      columnId: "column2",
      title: "4 Remove Admin Panel Colors",
      description: "",
      priority: "low",
    },
    task5: {
      id: "task5",
      columnId: "column3",
      title: "4 Remove Admin Panel Colors",
      description: "4 Remove Admin Panel Colors",
      branchName: "copy-write-app",
      priority: "medium",
    },
    task6: {
      id: "task6",
      columnId: "column3",
      title: "4 Remove Admin Panel Colors",
      description: "4 Remove Admin Panel Colors",
      branchName: "copy-write-app",
      priority: "low",
    },
    task7: {
      id: "task7",
      columnId: "column3",
      title: "4 Remove Admin Panel Colors",
      description: "4 Remove Admin Panel Colors",
      branchName: "copy-write-app",
      priority: "high",
    },
  },
};

export const saveBoardDataLocally = (newBoardData: BoardState) => {
  localStorage.setItem("boardState", JSON.stringify(newBoardData));
};
