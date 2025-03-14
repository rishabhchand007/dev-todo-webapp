"use client";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useMemo } from "react";
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
import TaskCard from "../components/TaskCard";
import { createPortal } from "react-dom";
import { useBoardStore } from "../store/useBoardStore";
import AddEditTaskModal from "../components/AddEditTaskModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

const Board = () => {
  const {
    board,
    activeId,
    openDeleteModal,
    deleteData,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    openAddModal,
    setOpenAddModal,
    taskEditData,
    setTaskEditData,
    setOpenDeleteModel,
    setDeleteData,
  } = useBoardStore();

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
                {activeId &&
                  activeId.toString().includes("task") &&
                  board.tasks[activeId] && (
                    <>
                      <TaskCard
                        id={activeId.toString()}
                        columnId={board.tasks[activeId].columnId}
                        title={board.tasks[activeId].title}
                        description={board.tasks[activeId].description}
                        branchName={board.tasks[activeId].branchName}
                      />
                    </>
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
      {openAddModal && (
        <AddEditTaskModal
          open={openAddModal}
          onClose={() => {
            setOpenAddModal(false);
            setTaskEditData(undefined);
          }}
          taskEditData={taskEditData}
        />
      )}
      {openDeleteModal && (
        <DeleteConfirmationModal
          open={openDeleteModal}
          onClose={() => {
            setOpenDeleteModel(false);
            setDeleteData(undefined);
          }}
          deleteData={deleteData}
        />
      )}
    </>
  );
};

export default Board;
