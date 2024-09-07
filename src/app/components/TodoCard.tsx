import React from "react";
import Draggable from "./Draggable";
import { Card } from "@/components/ui/card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
}

const TodoCard = ({ id, title, description }: TodoItem) => {
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
      type: "item",
    },
  });
  return (
    <Card
      className="px-[16px] py-[20px]"
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      {...attributes}
      {...listeners}
    >
      <div className="text-[16px] font-[700]">{title}</div>
      {description && (
        <div className="text-[12px] text-textGrey pt-2">{description}</div>
      )}
    </Card>
  );
};

export default TodoCard;
