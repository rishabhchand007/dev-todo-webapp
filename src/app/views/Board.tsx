"use client";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import Droppable from "../components/Droppable";
import Draggable from "../components/Draggable";
import { useState } from "react";
import { title } from "process";
import { Card } from "@/components/ui/card";
import TodoCard from "../components/TodoCard";
import BoardColumn from "../components/BoardColumn";

const Board = () => {
  const containers = ["A", "B", "C"];

  const arr = [
    {
      id: "1",
      title: "TODO",
      itemList: [
        {
          id: "1",
          title: "Lorem",
          description: "",
        },
        {
          id: "2",
          title: "Ipsum",
          description: "asdasd",
        },
        {
          id: "3",
          title: "Ipsum",
          description: "",
        },
        {
          id: "4",
          title: "asdasdasd",
          description: "",
        },
      ],
    },
    { id: "2", title: "IN WORK" },
    { id: "3", title: "COMPLETED" },
  ];
  const [parent, setParent] = useState<string | null>(null);

  function handleDragEnd(event: DragEndEvent) {
    const { over } = event;

    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    setParent(over ? String(over.id) : null);
  }

  return (
    <div className="px-12 py-7 flex gap-[30px]">
      <DndContext onDragEnd={handleDragEnd}>
        {/* {parent === null ? draggableMarkup : null} */}

        {arr?.map((column) => (
          <BoardColumn column={column} />
        ))}
      </DndContext>
    </div>
  );
};

export default Board;
