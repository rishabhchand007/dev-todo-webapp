import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  GitBranchIcon,
  HighPriorityIcon,
  LowPriorityIcon,
  MediumPriorityIcon,
} from "../icons";
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
  title: z.string().min(1, { message: "Title is required." }).max(50),
  description: z.string().max(150),
  branchName: z.string().max(150),
  priority: z.string().min(1, { message: "Priority is required." }).max(50),
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
          priority: taskEditData?.priority || "medium",
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
        <DialogContent
          onOpenAutoFocus={(e) => taskEditData && e.preventDefault()}
        >
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
              onSubmit={form.handleSubmit((formData) => {
                console.log(formData, "formData");
                taskEditData?.id
                  ? editTask(taskEditData.columnId, taskEditData.id, formData)
                  : addNewTask(String(open), formData);
              })}
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
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" flex items-center gap-1">
                      Priority
                    </FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="">
                          <SelectValue placeholder="Select Priority Level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="high">
                            <HighPriorityIcon />
                            High
                          </SelectItem>
                          <SelectItem value="medium">
                            <MediumPriorityIcon /> Medium
                          </SelectItem>
                          <SelectItem value="low">
                            <LowPriorityIcon />
                            Low
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>

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
