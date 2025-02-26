import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "@/components/ui/textarea";
import { GitBranchIcon } from "../icons";
import { Button } from "@/components/ui/button";
import { TaskState } from "@/common/types";

interface AddTaskModalProps {
  open: boolean | string;
  onClose: () => void;
  handleAddTask: (columnId: string | boolean, addDetails: TaskState) => void;
}

const AddTaskModal = ({ open, onClose, handleAddTask }: AddTaskModalProps) => {
  const [addDetails, setAddDetails] = useState<TaskState>({
    title: "",
    description: "",
    branchName: "",
  });

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setAddDetails((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  console.log(addDetails, "addDetails");
  return (
    <>
      <Dialog open={Boolean(open)} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Add a new task in the column here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={addDetails?.title}
                className="col-span-3"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={addDetails?.description}
                className="col-span-3"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="branchName"
                className=" flex justify-end items-center gap-2"
              >
                <GitBranchIcon />
                Git Branch
              </Label>
              <Input
                id="branchName"
                value={addDetails?.branchName}
                className="col-span-3"
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={() => handleAddTask(open, addDetails)}
            >
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddTaskModal;
