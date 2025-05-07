
import SiteFooter from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AuthProvider } from '@/contexts/AuthContext'
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
import { Outlet, createRootRoute } from '@tanstack/react-router'

const queryClient = new QueryClient()


export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SiteHeader />
        <Outlet />
        <SiteFooter />
        <TanStackRouterDevtools />
      </AuthProvider>
    </QueryClientProvider>
  ),
})
