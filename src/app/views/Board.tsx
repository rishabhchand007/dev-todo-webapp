"use client";
import {
  closestCorners,
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import BoardColumn, { Column } from "../components/BoardColumn";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import TodoCard from "../components/TaskCard";
import { TouchSensor, MouseSensor } from "../utilities/dndSensors";
import { BoardState } from "@/common/types";
import TaskCard from "../components/TaskCard";
const arr = [
  {
    id: "container-1",
    title: "TODO",
    itemList: [
      {
        id: "item-1",
        title: "Copywriting of the app",
        description:
          "Composing words to provide people with decision-making clarity when interacting with a product.",
        branchName: "copy-write-app",
      },
      {
        id: "item2",
        title: "Add new dropdown in the froms",
        description: "add, delete, remove and update options",
        branchName: "feat-dropdown",
      },
      {
        id: "item3",
        title: "Remove Admin Panel Colors",
        description: "",
      },
    ],
    itemCount: 3,
  },
  {
    id: "container-2",
    title: "IN WORK",
    itemList: [
      {
        id: "item5",
        title: "Github Integration",
        description: "processing in the backend",
      },
      {
        id: "item6",
        title: "asdasdasd",
        description: "",
      },
    ],
    itemCount: 3,
  },
  { id: "container-3", title: "COMPLETED", itemList: [], itemCount: 0 },
];

const boardState: BoardState = {
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
      title: "Copywriting of the app",
      description:
        "Composing words to provide people with decision-making clarity.",
      branchName: "copy-write-app",
      order: 1,
    },
    task2: {
      id: "task2",
      columnId: "column1",
      title: "Add new dropdown in the forms",
      description: "Add, delete, remove and update options.",
      branchName: "feat-dropdown",
      order: 2,
    },
    task3: {
      id: "task3",
      columnId: "column2",
      title: "Github Integration",
      description: "Processing in the backend",
      order: 1,
    },
    task4: {
      id: "task4",
      columnId: "column2",
      title: "Remove Admin Panel Colors",
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
  const [columns, setColumns] = useState<Column[]>(arr);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  // Find the value of the items
  function findValueOfItems(id: UniqueIdentifier | undefined, type: string) {
    if (type === "container") {
      return columns.find((item) => item.id === id);
    }
    if (type === "item") {
      return columns.find((container) =>
        container?.itemList?.find((item) => item.id === id)
      );
    }
  }

  const findItem = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "item");
    if (!container) return undefined;
    const item = container?.itemList?.find((item) => item.id === id);
    if (!item) return undefined;
    return item;
  };

  const findContainer = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "container");
    if (!container) return undefined;
    return container;
  };

  const findContainerItems = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "container");
    if (!container) return [];
    return container?.itemList;
  };

  // Dnd Handlers
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const { id } = active;
    setActiveId(id);
  };
  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;

    // Handle Items Sorting
    if (
      active.id.toString().includes("item") &&
      over?.id.toString().includes("item") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active container and over container
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "item");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;

      // Find the index of the active and over container
      const activeContainerIndex = columns.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = columns.findIndex(
        (container) => container.id === overContainer.id
      );

      // Find the index of the active and over item
      const activeitemIndex = activeContainer?.itemList?.findIndex(
        (item) => item.id === active.id
      );
      const overitemIndex = overContainer?.itemList?.findIndex(
        (item) => item.id === over.id
      );
      // In the same container
      if (activeContainerIndex === overContainerIndex) {
        let newItems = [...columns];
        newItems[activeContainerIndex].itemList = arrayMove(
          newItems[activeContainerIndex].itemList,
          activeitemIndex,
          overitemIndex
        );

        setColumns(newItems);
      } else {
        // In different columns
        let newItems = [...columns];
        const [removeditem] = newItems?.[
          activeContainerIndex
        ]?.itemList?.splice(activeitemIndex, 1);
        newItems?.[overContainerIndex].itemList?.splice(
          overitemIndex,
          0,
          removeditem
        );
        setColumns(newItems);
      }
    }

    // Handling Item Drop Into a Container
    if (
      active.id.toString().includes("item") &&
      over?.id.toString().includes("container") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "container");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;

      // Find the index of the active and over container
      const activeContainerIndex = columns.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = columns.findIndex(
        (container) => container.id === overContainer.id
      );

      // Find the index of the active and over item
      const activeitemIndex = activeContainer.itemList?.findIndex(
        (item) => item.id === active.id
      );

      // Remove the active item from the active container and add it to the over container
      let newItems = [...columns];
      const [removeditem] = newItems[activeContainerIndex].itemList?.splice(
        activeitemIndex,
        1
      );
      newItems[overContainerIndex].itemList?.push(removeditem);
      setColumns(newItems);
    }
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Handling Container Sorting
    if (
      active.id.toString().includes("container") &&
      over?.id.toString().includes("container") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the index of the active and over container
      const activeContainerIndex = columns.findIndex(
        (container) => container.id === active.id
      );
      const overContainerIndex = columns.findIndex(
        (container) => container.id === over.id
      );
      // Swap the active and over container
      let newItems = [...columns];
      newItems = arrayMove(newItems, activeContainerIndex, overContainerIndex);
      setColumns(newItems);
    }

    // Handling item Sorting
    if (
      active.id.toString().includes("item") &&
      over?.id.toString().includes("item") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "item");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;
      // Find the index of the active and over container
      const activeContainerIndex = columns.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = columns.findIndex(
        (container) => container.id === overContainer.id
      );
      // Find the index of the active and over item
      const activeitemIndex = activeContainer?.itemList?.findIndex(
        (item) => item.id === active.id
      );
      const overitemIndex = overContainer?.itemList?.findIndex(
        (item) => item.id === over.id
      );

      // In the same container
      if (activeContainerIndex === overContainerIndex) {
        let newItems = [...columns];
        newItems[activeContainerIndex].itemList = arrayMove(
          newItems?.[activeContainerIndex]?.itemList,
          activeitemIndex,
          overitemIndex
        );
        setColumns(newItems);
      } else {
        // In different columns
        let newItems = [...columns];
        const [removeditem] = newItems[activeContainerIndex].itemList.splice(
          activeitemIndex,
          1
        );
        newItems[overContainerIndex].itemList.splice(
          overitemIndex,
          0,
          removeditem
        );
        setColumns(newItems);
      }
    }
    // Handling item dropping into Container
    if (
      active.id.toString().includes("item") &&
      over?.id.toString().includes("container") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "container");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;
      // Find the index of the active and over container
      const activeContainerIndex = columns.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = columns.findIndex(
        (container) => container.id === overContainer.id
      );
      // Find the index of the active and over item
      const activeitemIndex = activeContainer.itemList.findIndex(
        (item) => item.id === active.id
      );

      let newItems = [...columns];
      const [removeditem] = newItems[activeContainerIndex].itemList.splice(
        activeitemIndex,
        1
      );
      newItems[overContainerIndex].itemList.push(removeditem);
      setColumns(newItems);
    }
    setActiveId(null);
  };

  return (
    <div className="px-12 py-7 flex gap-[30px]">
      <DndContext
        onDragEnd={handleDragEnd}
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
      >
        <SortableContext items={Object.keys(boardState?.columns)}>
          {Object.values(boardState?.columns)?.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              tasks={boardState?.tasks}
            />
          ))}
        </SortableContext>

        {/* <DragOverlay adjustScale={false} dropAnimation={dropAnimation}>
          {activeId && activeId.toString().includes("item") && (
            <TaskCard
              id={activeId}
              title={findItem(activeId).title}
              description={findItem(activeId)?.description}
              branchName={findItem(activeId)?.branchName}
            />
          )}
          {activeId && activeId.toString().includes("container") && (
            <BoardColumn column={findContainer(activeId)} />
          )}
        </DragOverlay> */}
      </DndContext>
    </div>
  );
};

export default Board;
