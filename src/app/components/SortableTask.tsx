import { Task } from "@/common/types";
import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import TaskCard from "./TaskCard";
import { CSS } from "@dnd-kit/utilities";

const SortableTask = ({
  id,
  columnId,
  title,
  description,
  branchName,
  priority,
}: Task) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: "Task",
    },
  });
  return (
    <div
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : undefined,
      }}
      {...attributes}
      {...listeners}
    >
      <TaskCard
        id={id}
        columnId={columnId}
        title={title}
        description={description}
        branchName={branchName}
        priority={priority}
      />
    </div>
  );
};

export default SortableTask;
