import React from "react";
import { Card } from "@/components/ui/card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CopyIcon, DeleteIcon, EditIcon, GitBranchIcon } from "../icons";
import { Task } from "@/common/types";

const TaskCard = ({ id, title, description, branchName }: Task) => {
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
      className="p-[16px] bg-todoCardBackground hover:border-textWhite group"
      ref={setNodeRef}
      {...attributes}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : undefined,
      }}
      {...listeners}
    >
      <div className="flex justify-between items-start relative ">
        <div className="text-[14px] font-[700]">{title}</div>
        <div
          className="flex gap-[6px] pt-1 absolute right-0 bg-todoCardBackground ps-1 hidden group-hover:flex"
          data-no-dnd
        >
          <EditIcon />
          <DeleteIcon />
        </div>
      </div>
      {description && (
        <div className="text-[12px] text-textGrey pt-3">{description}</div>
      )}

      <div
        className="text-[12px] text-textGrey pt-3 flex items-center w-max"
        data-no-dnd
      >
        <GitBranchIcon />
        {branchName ? (
          <>
            <div className="ps-1 pe-2 text-ellipsis overflow-hidden whitespace-nowrap">
              {branchName}{" "}
            </div>
            <CopyIcon />
          </>
        ) : (
          <div
            className="ps-1 text-[#7db87d] hover:text-[#629562] "
            onClick={(e) => console.log(e, "EVENT")}
          >
            Add Branch
          </div>
        )}
      </div>
    </Card>
  );
};

export default TaskCard;
