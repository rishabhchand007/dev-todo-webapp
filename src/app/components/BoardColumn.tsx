import React from "react";
import Droppable from "./Droppable";
import TodoCard, { TodoItem } from "./TodoCard";

interface Column {
  title: string;
  id: string;
  itemList?: TodoItem[];
}

interface BoardColumnProps {
  column: Column;
}

const BoardColumn = ({ column }: BoardColumnProps) => {
  return (
    <div className="w-[250px]">
      <div className="flex border-b-2 border-[#1E293B] pb-4 text-[14px] font-[700] mb-[32px]">
        {column.title}
      </div>
      <Droppable key={column.id} id={column.id}>
        <>
          {column?.itemList?.map((item) => (
            <TodoCard
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
            />
          ))}
        </>
      </Droppable>
    </div>
  );
};

export default BoardColumn;
