import React from "react";
import TodoCard, { TodoItem } from "./TodoCard";
import {
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { UniqueIdentifier } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { AddIcon } from "../icons";

export interface Column {
  title: string;
  id: string;
  itemList?: TodoItem[];
  itemCount: number;
}

interface BoardColumnProps {
  column: Column;
}

const BoardColumn = ({ column }: BoardColumnProps) => {
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
      type: "container",
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
        <SortableContext items={column?.itemList?.map((item) => item.id) ?? []}>
          {column?.itemList?.map((item) => (
            <TodoCard
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              branchName={item.branchName}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default BoardColumn;
