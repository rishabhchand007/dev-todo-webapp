"use client";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useMemo, useState } from "react";
import BoardColumn from "../components/BoardColumn";
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
  TouchSensor,
  MouseSensor,
  dropAnimation,
} from "../utilities/dndSensors";
import { BoardState } from "@/common/types";
import TaskCard from "../components/TaskCard";
import { createPortal } from "react-dom";
import AddTaskModal from "../components/AddTaskModal";
import { addNewTask } from "../services/taskService";
import { useBoardStore } from "../store/useBoardStore";

const Board = () => {
  const { board, activeId, handleDragStart, handleDragOver, handleDragEnd } =
    useBoardStore();
  const [openAddModal, setOpenAddModal] = useState<string | boolean>(false);

  const memorizedColumnIds = useMemo(
    () => Object.keys(board.columns),
    [board.columns]
  );

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <>
      <div className="px-12 py-7 flex gap-[30px]">
        <DndContext
          onDragEnd={handleDragEnd}
          sensors={sensors}
          // collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
        >
          <SortableContext items={memorizedColumnIds}>
            {Object.values(board.columns)?.map((column) => (
              <BoardColumn
                key={column.id}
                column={column}
                tasks={board.tasks}
                openAddTaskModel={(columnId) => setOpenAddModal(columnId)}
              />
            ))}
          </SortableContext>

          {"document" in window &&
            createPortal(
              <DragOverlay adjustScale={false} dropAnimation={dropAnimation}>
                {activeId && activeId.toString().includes("task") && (
                  <TaskCard
                    id={activeId.toString()}
                    title={board.tasks[activeId].title}
                    description={board.tasks[activeId].description}
                    branchName={board.tasks[activeId].branchName}
                  />
                )}
                {activeId && activeId.toString().includes("column") && (
                  <BoardColumn
                    column={board.columns[activeId]}
                    tasks={board.tasks}
                  />
                )}
              </DragOverlay>,
              document.body
            )}
        </DndContext>
      </div>
      <AddTaskModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        handleAddTask={addNewTask}
      />
    </>
  );
};

export default Board;
