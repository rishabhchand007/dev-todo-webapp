"use client";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import BoardColumn, { Column } from "../components/BoardColumn";
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import TodoCard from "../components/TodoCard";
const arr = [
  {
    id: "col-1",
    title: "TODO",
    itemList: [
      {
        id: "item-1",
        title: "Lorem",
        description: "",
      },
      {
        id: "item2",
        title: "Ipsum",
        description: "asdasd",
      },
      {
        id: "item3",
        title: "Ipsum",
        description: "",
      },
      {
        id: "item4",
        title: "asdasdasd",
        description: "",
      },
    ],
  },
  {
    id: "col-2",
    title: "IN WORK",
    itemList: [
      {
        id: "item5",
        title: "Ipsum",
        description: "",
      },
      {
        id: "item6",
        title: "asdasdasd",
        description: "",
      },
    ],
  },
  { id: "col-3", title: "COMPLETED", itemList: [] },
];
const Board = () => {
  const [containers, setContainers] = useState<Column[]>(arr);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [currentContainerId, setCurrentContainerId] =
    useState<UniqueIdentifier>();
  const [containerName, setContainerName] = useState("");
  const [itemName, setItemName] = useState("");
  const [showAddContainerModal, setShowAddContainerModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  // Find the value of the items
  function findValueOfItems(id: UniqueIdentifier | undefined, type: string) {
    if (type === "container") {
      return containers.find((item) => item.id === id);
    }
    if (type === "item") {
      return containers.find((container) =>
        container?.itemList?.find((item) => item.id === id)
      );
    }
  }

  const findItemTitle = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "item");
    if (!container) return "";
    const item = container?.itemList?.find((item) => item.id === id);
    if (!item) return "";
    return item.title;
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
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const { id } = active;
    console.log("LOLO,", id);
    setActiveId(id);
  };
  const handleDragMove = (event: DragMoveEvent) => {};
  const handleDragEnd = (event: DragEndEvent) => {};

  return (
    <div className="px-12 py-7 flex gap-[30px]">
      <DndContext
        onDragEnd={handleDragEnd}
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
      >
        <SortableContext items={containers.map((i) => i.id)}>
          {containers?.map((column) => (
            <BoardColumn key={column.id} column={column} />
          ))}
        </SortableContext>

        <DragOverlay adjustScale={false}>
          {activeId && activeId.toString().includes("item") && (
            <TodoCard id={activeId} title={findItemTitle(activeId)} />
          )}
          {activeId && activeId.toString().includes("col") && (
            <BoardColumn column={findContainer(activeId)} />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Board;
