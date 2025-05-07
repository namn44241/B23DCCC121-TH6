export interface ITask {
  id: string;
  title: string;
  priority: PriorityType;
  assignee?: string;
  dueDate?: string;
}

export type PriorityType = "low" | "medium" | "high";

export interface IUseSheetTaskFormProps {
  task?: ITask
  onSubmit: (task: ITask) => void
}

export interface ISheetTaskFormProps {
  open: boolean
  setOpen: (open: boolean) => void
  form: UseFormReturn<SheetTaskFormValues>
  isEditMode: boolean
  onSubmit: (values: SheetTaskFormValues) => void
}

export interface ITaskStatisticsProps {
  statistics: {
    totalTasks: number
    highPriorityTasks: number
    mediumPriorityTasks: number
    lowPriorityTasks: number
    tasksByStatus: Record<string, number>
    completionRate: number
    overdueTasks: number
  }
}

export interface ITaskFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  priorityFilter: PriorityType | "all"
  setPriorityFilter: (priority: PriorityType | "all") => void
  assigneeFilter: string
  setAssigneeFilter: (assignee: string) => void
  uniqueAssignees: string[]
  resetFilters: () => void
}


export interface ITaskStatistics {
  totalTasks: number
  highPriorityTasks: number
  mediumPriorityTasks: number
  lowPriorityTasks: number
  tasksByStatus: Record<string, number>
  completionRate: number
  overdueTasks: number
}
