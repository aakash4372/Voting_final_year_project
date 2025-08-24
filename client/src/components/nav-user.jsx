import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import {
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavUser({ user }) {
  const { isMobile } = useSidebar();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login"); // Redirect to login after logout
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const goToAccount = () => navigate("/admin_dashboard/profile"); // Account route
  const goToNotifications = () => navigate("/"); // Notifications route

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-[#9893b0] data-[state=open]:text-[#ffffff] text-[#ffffff] hover:bg-[#9893b0] hover:text-[#000000]"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-[#9893b0] text-[#ffffff]">
                  {user?.name ? user.name.slice(0,2).toUpperCase():'??' }
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium text-[#ffffff]">
                  {user.name}
                </span>
                <span className="text-[#e0f7fa] truncate text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4 text-[#ffffff]" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-56 rounded-lg bg-[#ffffff] dark:bg-[#1c2526] text-[#000000] dark:text-[#e0f7fa]"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-[#9893b0] text-[#ffffff]">
                    {user?.name ? user.name.slice(0, 2).toUpperCase() : "??"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium text-[#000000] dark:text-[#e0f7fa]">
                    {user.name}
                  </span>
                  <span className="text-[#4b5e71] dark:text-[#90a4ae] truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                className="hover:bg-[#9893b0] hover:text-[#000000]"
                onClick={goToAccount}
              >
                <IconUserCircle className="text-[#000000] dark:text-[#e0f7fa]" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-[#9893b0] hover:text-[#000000]"
                onClick={goToNotifications}
              >
                <IconNotification className="text-[#000000] dark:text-[#e0f7fa]" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="hover:bg-[#ff5252] hover:text-[#ffffff]"
            >
              <IconLogout className="text-[#000000] dark:text-[#e0f7fa]" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
