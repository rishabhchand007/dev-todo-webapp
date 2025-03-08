import { Task } from "@/common/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import React from "react";
import { useBoardStore } from "../store/useBoardStore";

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  deleteData: Task | undefined;
}

const DeleteConfirmationModal = ({
  open,
  onClose,
  deleteData,
}: DeleteConfirmationModalProps) => {
  const { deleteTask } = useBoardStore();
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
          <DialogDescription>
            {`Are you sure you want to delete '${deleteData?.title}' task.`}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              deleteData?.id && deleteTask(deleteData);
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
