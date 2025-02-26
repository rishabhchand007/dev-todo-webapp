import { TaskState } from "@/common/types";

export const addNewTask = (
  columnId: string | boolean,
  addDetails: TaskState
) => {
  console.log(columnId, addDetails);
};
