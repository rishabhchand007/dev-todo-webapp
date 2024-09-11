"use client";
import {
  closestCorners,
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  KeyboardSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useMemo, useState } from "react";
import BoardColumn from "../components/BoardColumn";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import TodoCard from "../components/TaskCard";
import { TouchSensor, MouseSensor } from "../utilities/dndSensors";
import { BoardState } from "@/common/types";
import TaskCard from "../components/TaskCard";
import { createPortal } from "react-dom";

const initialDataLoad: BoardState = {
  columns: {
    column1: {
      id: "column1",
      title: "TODO",
      taskIds: ["task1", "task2"],
      order: 1,
      itemCount: 2,
    },
    column2: {
      id: "column2",
      title: "IN WORK",
      taskIds: ["task3", "task4"],
      order: 2,
      itemCount: 2,
    },
    column3: {
      id: "column3",
      title: "COMPLETED",
      taskIds: [],
      order: 3,
      itemCount: 0,
    },
  },
  tasks: {
    task1: {
      id: "task1",
      columnId: "column1",
      title: "1 Copywriting of the app",
      description:
        "Composing words to provide people with decision-making clarity.",
      branchName: "copy-write-app",
      order: 1,
    },
    task2: {
      id: "task2",
      columnId: "column1",
      title: "2 Add new dropdown in the forms",
      description: "Add, delete, remove and update options.",
      branchName: "feat-dropdown",
      order: 2,
    },
    task3: {
      id: "task3",
      columnId: "column2",
      title: "3 Github Integration",
      description: "Processing in the backend",
      order: 1,
    },
    task4: {
      id: "task4",
      columnId: "column2",
      title: "4 Remove Admin Panel Colors",
      description: "",
      order: 2,
    },
  },
};

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};
const Board = () => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [boardState, setBoardState] = useState<BoardState>(initialDataLoad);

  const memorizedColumnIds = useMemo(
    () => Object.keys(boardState?.columns),
    [boardState?.columns]
  );

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="px-12 py-7 flex gap-[30px]">
      <DndContext
        // onDragEnd={handleDragEnd}
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
      >
        <SortableContext items={memorizedColumnIds}>
          {Object.values(boardState?.columns)?.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              tasks={boardState?.tasks}
            />
          ))}
        </SortableContext>

        {"document" in window &&
          createPortal(
            <DragOverlay adjustScale={false} dropAnimation={dropAnimation}>
              {activeId && activeId.toString().includes("task") && (
                <TaskCard
                  id={activeId.toString()}
                  title={boardState.tasks[activeId].title}
                  description={boardState.tasks[activeId].description}
                  branchName={boardState.tasks[activeId].branchName}
                />
              )}
              {activeId && activeId.toString().includes("column") && (
                <BoardColumn
                  column={boardState.columns[activeId]}
                  tasks={boardState?.tasks}
                />
              )}
            </DragOverlay>,
            document.body
          )}
      </DndContext>
    </div>
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const { id } = active;
    console.log(active, "active");
    setActiveId(id);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveATask = activeData?.type === "Task";
    const isOverATask = overData?.type === "Task";

    if (!isActiveATask) return;
    setTimeout(
      () =>
        setBoardState((board) => {
          const newBoard = structuredClone(board);
          const { tasks, columns } = newBoard;

          const activeTask = tasks[activeId];
          const activeColumn = columns[activeTask.columnId];

          if (!activeTask || !activeColumn) return board; // Safety check

          if (isOverATask) {
            const overTask = tasks[overId];
            const overColumn = columns[overTask.columnId];

            if (!overTask || !overColumn) return board; // Safety check

            const activeIndex = activeColumn.taskIds.indexOf(
              activeId as string
            );
            const overIndex = overColumn.taskIds.indexOf(overId as string);

            // Moving between different columns
            if (activeTask.columnId !== overTask.columnId) {
              activeColumn.taskIds = activeColumn.taskIds.filter(
                (id) => id !== activeId
              );
              overColumn.taskIds.splice(overIndex, 0, activeId as string); // Insert at correct position

              activeTask.columnId = overTask.columnId; // Update task's columnId
            } else {
              // Reordering within the same column
              activeColumn.taskIds = arrayMove(
                activeColumn.taskIds,
                activeIndex,
                overIndex
              );
            }
          }

          const isOverAColumn = overData?.type === "Column";
          if (isOverAColumn) {
            const overColumn = columns[overId];

            // Remove from current column
            activeColumn.taskIds = activeColumn.taskIds.filter(
              (id) => id !== activeId
            );
            // Add to new column at the end
            overColumn.taskIds.push(activeId as string);

            // Update task's columnId
            activeTask.columnId = overId as string;
          }

          return newBoard;
        }),
      0
    );
  }
};

export default Board;
