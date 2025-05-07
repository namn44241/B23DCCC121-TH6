import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"

import type { ITask, IUseSheetTaskFormProps, PriorityType } from "../utils/types"

const sheetTaskFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: "Tiêu đề không được để trống" }),
  priority: z.enum(["low", "medium", "high"] as const),
  assignee: z.string().optional(),
  dueDate: z.date().optional(),
})

export type SheetTaskFormValues = z.infer<typeof sheetTaskFormSchema>

export function useSheetTaskForm({ task, onSubmit }: IUseSheetTaskFormProps) {
  const [open, setOpen] = useState(false)
  const isEditMode = !!task

  const form = useForm<SheetTaskFormValues>({
    resolver: zodResolver(sheetTaskFormSchema),
    defaultValues: {
      id: task?.id || "",
      title: task?.title || "",
      priority: task?.priority || "medium",
      assignee: task?.assignee || "",
      dueDate: task?.dueDate ? new Date(task.dueDate) : undefined,
    },
  })

  useEffect(() => {
    if (task) {
      form.reset({
        id: task.id,
        title: task.title,
        priority: task.priority,
        assignee: task.assignee || "",
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      });
    } else {
      form.reset({
        id: "",
        title: "",
        priority: "medium",
        assignee: "",
        dueDate: undefined,
      });
    }
  }, [task, form]);

  const handleSubmit = (values: SheetTaskFormValues) => {
    const formattedTask: ITask = {
      id: values.id || crypto.randomUUID(),
      title: values.title,
      priority: values.priority as PriorityType,
      assignee: values.assignee || undefined,
      dueDate: values.dueDate ? format(values.dueDate, "yyyy-MM-dd") : undefined,
    }

    onSubmit(formattedTask)
    setOpen(false)
  }

  return {
    form,
    open,
    setOpen,
    isEditMode,
    handleSubmit,
  }
}