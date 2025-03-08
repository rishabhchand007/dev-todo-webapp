import React, { useMemo } from "react";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AddIcon } from "../icons";
import { Column, Task } from "@/common/types";
import TaskCard from "./TaskCard";
import SortableTask from "./SortableTask";

interface BoardColumnProps {
  column: Column;
  tasks: Record<string, Task>;
  openAddTaskModel?: (columnId: string) => void;
}

const BoardColumn = ({ column, tasks, openAddTaskModel }: BoardColumnProps) => {
  const {
    attributes,
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
    },
  });

  const memoizedTaskIds = useMemo(() => column?.taskIds, [column?.taskIds]);

  return (
    <div
      {...attributes}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : undefined,
      }}
      className="w-[282px] backdrop-blur-sm p-3 rounded-lg bg-white/[.01] min-h-56   "
      {...listeners}
    >
      <div className="flex border-b-2 border-[#1E293B] pb-3 px-3 mb-6 justify-between items-center">
        <div className="flex text-[16px] font-[700]">
          {column.title}
          <div className=" px-[10px] pt-[1px] h-[20px] border-[1px] border-[#FFF] text-[#BBB] rounded-xl ms-[16px] text-[12px] ">
            {column.itemCount}
          </div>
        </div>
        <div
          data-no-dnd
          onClick={() => openAddTaskModel && openAddTaskModel(column.id)}
        >
          <AddIcon />
        </div>
      </div>

      <div className="flex  flex-col gap-y-4 overflow-auto h-[calc(100dvh-14rem)]">
        <SortableContext items={memoizedTaskIds}>
          {column?.taskIds?.map((item) => (
            <SortableTask
              key={tasks[item].id}
              id={tasks[item].id}
              title={tasks[item].title}
              description={tasks[item].description}
              branchName={tasks[item].branchName}
              columnId={tasks[item].columnId}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default BoardColumn;
