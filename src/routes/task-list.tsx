import { TaskList } from '@/features/task-list'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/task-list')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='min-h-screen flex flex-col container-wrapper py-6'>
    <div className='container'>
      <TaskList />
    </div>
  </div>
}
