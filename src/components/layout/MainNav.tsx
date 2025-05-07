
import { docsConfig } from "@/config/docs"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Link, useRouterState } from "@tanstack/react-router"

const MainNav = () => {
    const router = useRouterState()
    const pathName = router.location.pathname


    return (
        <div className="mr-4 hidden md:flex">
            <Link to="/" className="mr-4 flex items-center gap-2 lg:mr-6">
                <p className="text-center text-primary font-semibold">{siteConfig.name}</p>
            </Link>
            <nav className="flex items-center gap-4 text-sm xl:gap-6">
                {
                    docsConfig.mainNav.map((item) => (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                "transition-colors hover:text-foreground/80",
                                pathName === item.href
                                    ? "text-foreground"
                                    : "text-foreground/80"
                            )}
                        >
                            <div className="flex items-center">
                                {item.icon && (
                                    <item.icon
                                        className="mr-2 size-4"
                                        aria-hidden="true"
                                    />
                                )}
                                {item.title}
                            </div>

                        </Link>
                    ))
                }
            </nav>
        </div>
    )
}

export default MainNav