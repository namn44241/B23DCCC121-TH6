import { createFileRoute } from "@tanstack/react-router"
export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="flex flex-col items-center min-h-screen select-none overflow-x-hidden">
    </div>
  )
}
