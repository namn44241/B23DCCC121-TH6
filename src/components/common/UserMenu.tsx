import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import type { IUser } from '@/types/User'
import { LogOut, User } from 'lucide-react'

interface IUserProfileMenuProps {
    user: IUser
    logout: () => void
    variant?: any
}
const UserMenu = ({ user, logout, variant = 'default' }: IUserProfileMenuProps) => {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={variant}
                    className="relative p-0 rounded-full size-8 overflow-hidden"
                    size="sm"
                >
                    <Avatar className="size-8 antialiased">
                        <AvatarImage
                            src={user.avatar}
                            alt={user.email}
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-primary/10 text-sm">
                            {user.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 z-[100]" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">

                        <p className="font-medium text-sm line-clamp-1 leading-none">{user.email}</p>
                        <p className="text-muted-foreground text-xs line-clamp-1 leading-none">
                            {user.role === 'admin' ? 'Administrator' : ''}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <User className="mr-2 size-4" />
                        <span>My Profile</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 size-4" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserMenu