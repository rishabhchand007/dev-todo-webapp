import React from "react";
import Draggable from "./Draggable";
import { Card } from "@/components/ui/card";

export interface TodoItem {
  id: string;
  title: string;
  description: string;
}

const TodoCard = ({ id, title, description }: TodoItem) => {
  return (
    <Draggable id={id}>
      <Card className="px-[16px] py-[20px]">
        <div className="text-[16px] font-[700] pb-2">{title}</div>
        <div className="text-[12px] text-textGrey">{description}</div>
      </Card>
    </Draggable>
  );
};

export default TodoCard;
