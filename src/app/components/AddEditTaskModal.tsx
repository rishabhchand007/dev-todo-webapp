import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GitBranchIcon } from "../icons";
import { Button } from "@/components/ui/button";
import { Task, TaskState } from "@/common/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useBoardStore } from "../store/useBoardStore";

interface AddTaskModalProps {
  open: boolean | string;
  onClose: () => void;
  taskEditData: Task | undefined;
}

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is a required." }).max(50),
  description: z.string().max(50),
  branchName: z.string().max(50),
});

const AddEditTaskModal = ({
  open,
  onClose,
  taskEditData,
}: AddTaskModalProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: taskEditData?.id
      ? {
          title: taskEditData?.title,
          description: taskEditData?.description,
          branchName: taskEditData?.branchName,
        }
      : {
          title: "",
          description: "",
          branchName: "",
        },
  });

  const { addNewTask, editTask } = useBoardStore();
  return (
    <>
      <Dialog open={Boolean(open)} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {taskEditData?.id ? "Edit Task" : "Add New Task"}
            </DialogTitle>
            {/* <DialogDescription>
              Add a new task in the column here. Click save when you're done.
            </DialogDescription> */}
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((formData) =>
                taskEditData?.id
                  ? editTask(taskEditData.columnId, taskEditData.id, formData)
                  : addNewTask(String(open), formData)
              )}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="do or die" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                      This is your public display name.
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    {/* <FormDescription>
                      This is your public display name.
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="branchName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" flex items-center gap-1">
                      <GitBranchIcon />
                      Git Branch
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">
                  {taskEditData?.id ? "Save" : "Add Task"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddEditTaskModal;
