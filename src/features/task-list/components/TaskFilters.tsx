import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from 'lucide-react'
import type { ITaskFiltersProps, PriorityType } from "../utils/types"

export const TaskFilters = ({
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    assigneeFilter,
    setAssigneeFilter,
    uniqueAssignees,
    resetFilters
}: ITaskFiltersProps) => {
    return (
        <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Tìm kiếm công việc..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>
            <div className="flex gap-2">
                <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as PriorityType | "all")}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Mức độ ưu tiên" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả mức độ</SelectItem>
                        <SelectItem value="high">Cao</SelectItem>
                        <SelectItem value="medium">Trung bình</SelectItem>
                        <SelectItem value="low">Thấp</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Người thực hiện" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        {uniqueAssignees.map((assignee) => (
                            <SelectItem key={assignee} value={assignee}>
                                {assignee}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button variant="outline" onClick={resetFilters}>
                    Đặt lại
                </Button>
            </div>
        </div>
    )
}
