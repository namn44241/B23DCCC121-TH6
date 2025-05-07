import StatisticBlock from "@/components/common/StatisticBlock"
import type { ITaskStatisticsProps } from "../utils/types"

export const TaskStatistics = ({ statistics }: ITaskStatisticsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatisticBlock
        title="Tổng số công việc"
        value={statistics.totalTasks}
        trendingType="up"
        trendingValue={`${statistics.totalTasks > 0 ? Math.round((statistics.totalTasks / (statistics.totalTasks + 5)) * 100) : 0}%`}
        colorVariant="blue"
      />
      <StatisticBlock
        title="Công việc ưu tiên cao"
        value={statistics.highPriorityTasks}
        trendingType={statistics.highPriorityTasks > statistics.mediumPriorityTasks ? "up" : "down"}
        trendingValue={`${Math.abs(statistics.highPriorityTasks - statistics.mediumPriorityTasks)}`}
        colorVariant="destructive"
      />
      <StatisticBlock
        title="Tỷ lệ hoàn thành"
        value={`${statistics.completionRate}%`}
        trendingType="up"
        trendingValue={`${Math.round(statistics.completionRate / 10)}%`}
        colorVariant="green"
      />
      <StatisticBlock
        title="Công việc quá hạn"
        value={statistics.overdueTasks}
        trendingType={statistics.overdueTasks > 0 ? "up" : "down"}
        trendingValue={statistics.overdueTasks}
        colorVariant="default"
      />
    </div>
  )
}
