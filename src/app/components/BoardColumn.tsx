import React from "react";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AddIcon } from "../icons";
import { Column, Task } from "@/common/types";
import TaskCard from "./TaskCard";

interface BoardColumnProps {
  column: Column;
  tasks: Record<string, Task>;
}

const BoardColumn = ({ column, tasks }: BoardColumnProps) => {
  console.log(column, "column clg");
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

  return (
    <div
      {...attributes}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className="w-[260px]"
      {...listeners}
    >
      <div className="flex border-b-2 border-[#1E293B] pb-3 px-3 mb-6 justify-between items-center">
        <div className="flex text-[16px] font-[700]">
          {column.title}
          <div className=" px-[10px] pt-[1px] h-[20px] border-[1px] border-[#FFF] text-[#BBB] rounded-xl ms-[16px] text-[12px] ">
            {column.itemCount}
          </div>
        </div>
        <div>
          <AddIcon />
        </div>
      </div>

      <div className="flex  flex-col gap-y-4">
        <SortableContext items={Object.keys(column)}>
          {column?.taskIds?.map((item) => (
            <TaskCard
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
