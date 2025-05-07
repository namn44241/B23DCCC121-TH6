import { SAMPLE_TASKS, STORAGE_KEY } from "../utils/constants";
import type { ITask, ITaskStatistics, PriorityType } from "../utils/types";

export const taskService = {
  getTasks: (): Record<string, ITask[]> => {
    try {
      const storedTasks = localStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        return JSON.parse(storedTasks);
      }
      taskService.saveTasks(SAMPLE_TASKS);
      return SAMPLE_TASKS;
    } catch (error) {
      console.error("Lỗi khi lấy tasks:", error);
      return SAMPLE_TASKS;
    }
  },

  saveTasks: (tasks: Record<string, ITask[]>): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Lỗi khi lưu tasks:", error);
    }
  },

  getTaskColumn: (
    taskId: string,
    columns: Record<string, ITask[]>
  ): string | null => {
    for (const [column, tasks] of Object.entries(columns)) {
      if (tasks.some((t) => t.id === taskId)) {
        return column;
      }
    }
    return null;
  },

  addTask: (
    task: ITask,
    columns: Record<string, ITask[]>
  ): Record<string, ITask[]> => {
    const updatedColumns = {
      ...columns,
      backlog: [...columns.backlog, task],
    };
    taskService.saveTasks(updatedColumns);
    return updatedColumns;
  },

  updateTask: (
    task: ITask,
    columns: Record<string, ITask[]>
  ): Record<string, ITask[]> => {
    const columnKey = taskService.getTaskColumn(task.id, columns);
    if (!columnKey) return columns;

    const updatedColumns = {
      ...columns,
      [columnKey]: columns[columnKey].map((t) => (t.id === task.id ? task : t)),
    };
    taskService.saveTasks(updatedColumns);
    return updatedColumns;
  },

  deleteTask: (
    taskId: string,
    columns: Record<string, ITask[]>
  ): Record<string, ITask[]> => {
    const columnKey = taskService.getTaskColumn(taskId, columns);
    if (!columnKey) return columns;

    const updatedColumns = {
      ...columns,
      [columnKey]: columns[columnKey].filter((t) => t.id !== taskId),
    };
    taskService.saveTasks(updatedColumns);
    return updatedColumns;
  },

  updateColumns: (
    columns: Record<string, ITask[]>
  ): Record<string, ITask[]> => {
    taskService.saveTasks(columns);
    return columns;
  },


  getAllTasks: (columns: Record<string, ITask[]>): ITask[] => {
    return Object.values(columns).flat();
  },

  getUniqueAssignees: (columns: Record<string, ITask[]>): string[] => {
    const assignees = new Set<string>();
    taskService.getAllTasks(columns).forEach((task) => {
      if (task.assignee) assignees.add(task.assignee);
    });
    return Array.from(assignees);
  },

  getTaskStatistics: (columns: Record<string, ITask[]>): ITaskStatistics => {
    const allTasks = taskService.getAllTasks(columns);
    const totalTasks = allTasks.length;
    const highPriorityTasks = allTasks.filter(
      (task) => task.priority === "high"
    ).length;
    const mediumPriorityTasks = allTasks.filter(
      (task) => task.priority === "medium"
    ).length;
    const lowPriorityTasks = allTasks.filter(
      (task) => task.priority === "low"
    ).length;

    const tasksByStatus: Record<string, number> = {};
    Object.keys(columns).forEach((columnKey) => {
      tasksByStatus[columnKey] = columns[columnKey].length;
    });

    const completedTasks = columns["done"]?.length || 0;
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdueTasks = allTasks.filter((task) => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return (
        dueDate < today &&
        columns["done"]?.find((t) => t.id === task.id) === undefined
      );
    }).length;

    return {
      totalTasks,
      highPriorityTasks,
      mediumPriorityTasks,
      lowPriorityTasks,
      tasksByStatus,
      completionRate,
      overdueTasks,
    };
  },

  filterTasks: (
    columns: Record<string, ITask[]>,
    searchQuery: string,
    priorityFilter: PriorityType | "all",
    assigneeFilter: string
  ): Record<string, ITask[]> => {
    const result: Record<string, ITask[]> = {};

    Object.entries(columns).forEach(([columnKey, tasks]) => {
      result[columnKey] = tasks.filter((task) => {
        const matchesSearch = task.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesPriority =
          priorityFilter === "all" || task.priority === priorityFilter;
        const matchesAssignee =
          assigneeFilter === "all" || task.assignee === assigneeFilter;

        return matchesSearch && matchesPriority && matchesAssignee;
      });
    });

    return result;
  },
};
