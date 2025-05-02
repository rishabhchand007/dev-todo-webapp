import React from "react";
import { Card } from "@/components/ui/card";
import {
  CopyIcon,
  DeleteIcon,
  EditIcon,
  GitBranchIcon,
  HighPriorityIcon,
  LowPriorityIcon,
  MediumPriorityIcon,
} from "../icons";
import { useBoardStore } from "../store/useBoardStore";

interface TaskCardProps {
  id: string;
  columnId: string;
  title: string;
  description: string;
  branchName?: string;
  order?: number;
  priority: string;
}

const TaskCard = React.memo(
  ({
    id,
    columnId,
    title,
    description,
    branchName,
    priority,
  }: TaskCardProps) => {
    const setTaskEditData = useBoardStore((state) => state.setTaskEditData);
    const setOpenAddModal = useBoardStore((state) => state.setOpenAddModal);
    const setOpenDeleteModel = useBoardStore(
      (state) => state.setOpenDeleteModel
    );
    const setDeleteData = useBoardStore((state) => state.setDeleteData);
    return (
      <Card className="p-[16px] bg-todoCardBackground hover:border-textWhite group">
        <div className="flex justify-between items-start relative gap-1">
          <div>
            {priority === "low" ? (
              <LowPriorityIcon />
            ) : priority === "high" ? (
              <HighPriorityIcon />
            ) : (
              <MediumPriorityIcon />
            )}

            <span className="text-[14px] font-[700]">{title}</span>
          </div>
          <div
            className="flex gap-[6px] pt-1 absolute right-0 bg-todoCardBackground ps-1 hidden group-hover:flex"
            data-no-dnd
          >
            <div
              onClick={() => {
                setTaskEditData({
                  id,
                  columnId,
                  title,
                  description,
                  branchName,
                  priority,
                });
                setOpenAddModal(columnId);
              }}
            >
              <EditIcon />
            </div>
            <div
              onClick={() => {
                setOpenDeleteModel(true);
                setDeleteData({
                  id,
                  columnId,
                  title,
                  description,
                  branchName,
                  priority,
                });
              }}
            >
              <DeleteIcon />
            </div>
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
  }
);

export default TaskCard;
