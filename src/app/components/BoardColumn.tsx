import React from "react";
import Droppable from "./Droppable";
import TodoCard, { TodoItem } from "./TodoCard";
import {
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { UniqueIdentifier } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export interface Column {
  title: string;
  id: string;
  itemList?: TodoItem[];
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
      className="w-[250px]"
      {...listeners}
    >
      <div className="flex border-b-2 border-[#1E293B] pb-4 text-[14px] font-[700] mb-[32px]">
        {column.title}
      </div>
      <div className="flex  flex-col gap-y-4">
        <SortableContext items={column?.itemList?.map((item) => item.id) ?? []}>
          {column?.itemList?.map((item) => (
            <TodoCard
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default BoardColumn;
