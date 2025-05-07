import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import * as Kanban from "@/components/ui/kanban"
import { CirclePlus, GripVertical, Pencil, SquareKanban, Trash2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useSheetTaskForm } from "../hooks/useSheetTaskForm"
import { taskService } from "../services/taskService"
import { COLUMN_TITLES } from "../utils/constants"
import type { ITask, PriorityType } from "../utils/types"
import { SheetTaskForm } from "./SheetTaskForm"
import { TaskFilters } from "./TaskFilters"
import { TaskStatistics } from "./TaskStatistics"

export const TaskList = () => {
    const [columns, setColumns] = useState<Record<string, ITask[]>>({})
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [priorityFilter, setPriorityFilter] = useState<PriorityType | "all">("all")
    const [assigneeFilter, setAssigneeFilter] = useState<string | "all">("all")

    useEffect(() => {
        setColumns(taskService.getTasks())
    }, [])

    const uniqueAssignees = useMemo(() => {
        return taskService.getUniqueAssignees(columns)
    }, [columns])

    const statistics = useMemo(() => {
        return taskService.getTaskStatistics(columns)
    }, [columns])

    const filteredColumns = useMemo(() => {
        return taskService.filterTasks(columns, searchQuery, priorityFilter, assigneeFilter)
    }, [columns, searchQuery, priorityFilter, assigneeFilter])

    const getEditingTask = (): ITask | undefined => {
        if (!editingTaskId) return undefined

        for (const columnTasks of Object.values(columns)) {
            const task = columnTasks.find((t) => t.id === editingTaskId)
            if (task) return task
        }

        return undefined
    }

    const handleTaskSubmit = (task: ITask) => {
        if (editingTaskId) {
            setColumns(taskService.updateTask(task, columns))
            setEditingTaskId(null)
        } else {
            setColumns(taskService.addTask(task, columns))
        }
    }

    const handleDeleteTask = (taskId: string) => {
        setColumns(taskService.deleteTask(taskId, columns))
    }

    const handleColumnsChange = (newColumns: Record<string, ITask[]>) => {
        setColumns(taskService.updateColumns(newColumns))
    }

    const currentTask = getEditingTask()

    const { form, open, setOpen, isEditMode, handleSubmit } = useSheetTaskForm({
        task: currentTask,
        onSubmit: handleTaskSubmit,
    })

    const openEditForm = (taskId: string, e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        setEditingTaskId(taskId)
        setOpen(true)
    }

    const openCreateForm = () => {
        setEditingTaskId(null)
        setOpen(true)
    }

    const resetFilters = () => {
        setSearchQuery("")
        setPriorityFilter("all")
        setAssigneeFilter("all")
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-2xl">
                    <SquareKanban />
                    <p>Quản lý công việc</p>
                </div>

                <Button onClick={openCreateForm}>
                    Tạo công việc mới
                    <CirclePlus className="size-4" />
                </Button>
            </div>

            <TaskStatistics statistics={statistics} />
            
            <TaskFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                priorityFilter={priorityFilter}
                setPriorityFilter={setPriorityFilter}
                assigneeFilter={assigneeFilter}
                setAssigneeFilter={setAssigneeFilter}
                uniqueAssignees={uniqueAssignees}
                resetFilters={resetFilters}
            />

            <SheetTaskForm open={open} setOpen={setOpen} form={form} isEditMode={isEditMode} onSubmit={handleSubmit} />

            <Kanban.Root value={filteredColumns} onValueChange={handleColumnsChange} getItemValue={(item) => item.id}>
                <Kanban.Board className="grid auto-rows-fr sm:grid-cols-3">
                    {Object.entries(filteredColumns).map(([columnValue, tasks]) => (
                        <Kanban.Column key={columnValue} value={columnValue}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm">{COLUMN_TITLES[columnValue]}</span>
                                    <Badge variant="secondary" className="pointer-events-none rounded-sm">
                                        {tasks.length}
                                    </Badge>
                                </div>
                                <Kanban.KanbanColumnHandle asChild>
                                    <Button variant="ghost" size="icon" className="cursor-grab">
                                        <GripVertical className="size-4" />
                                    </Button>
                                </Kanban.KanbanColumnHandle>
                            </div>
                            <div className="flex flex-col gap-2 p-0.5">
                                {tasks.map((task) => (
                                    <Kanban.Item key={task.id} value={task.id} asChild>
                                        <div className="rounded-md border bg-card p-3 shadow-xs">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <Kanban.ItemHandle asChild>
                                                            <Button variant="ghost" size="icon" className="cursor-grab">
                                                                <GripVertical className="size-4" />
                                                            </Button>
                                                        </Kanban.ItemHandle>
                                                        <span className="line-clamp-1 font-medium text-sm">{task.title}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Badge
                                                            variant={
                                                                task.priority === "high"
                                                                    ? "destructive"
                                                                    : task.priority === "medium"
                                                                        ? "default"
                                                                        : "secondary"
                                                            }
                                                            className="pointer-events-none h-5 rounded-sm px-1.5 text-[11px] capitalize"
                                                        >
                                                            {task.priority === "high" ? "Cao" : task.priority === "medium" ? "Trung bình" : "Thấp"}
                                                        </Badge>
                                                        <Button variant="ghost" size="icon" onClick={(e) => openEditForm(task.id, e)}>
                                                            <Pencil className="size-4" />
                                                        </Button>

                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-destructive hover:bg-destructive/10"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleDeleteTask(task.id)
                                                            }}
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between text-muted-foreground text-xs">
                                                    {task.assignee && (
                                                        <div className="flex items-center gap-1">
                                                            <div className="size-2 rounded-full bg-primary/20" />
                                                            <span className="line-clamp-1">{task.assignee}</span>
                                                        </div>
                                                    )}
                                                    {task.dueDate && <time className="text-[10px] tabular-nums">{task.dueDate}</time>}
                                                </div>
                                            </div>
                                        </div>
                                    </Kanban.Item>
                                ))}
                            </div>
                        </Kanban.Column>
                    ))}
                </Kanban.Board>
                <Kanban.Overlay>
                    <div className="size-full rounded-md bg-primary/10" />
                </Kanban.Overlay>
            </Kanban.Root>
        </div>
    )
}
