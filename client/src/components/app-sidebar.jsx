// src/components/app-sidebar.jsx
import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { AuthContext } from "@/context/AuthContext";
import { sidebarMenuItems, validRoles } from "@/utils/SidebarMenuitem";
import Logo from "@/assets/img/logo2.png"; // Import your logo image

export function AppSidebar({ ...props }) {
  const { user } = React.useContext(AuthContext);

  // Get menu items based on user role, fallback to empty array if no user or invalid role
  const role = user?.role && validRoles.includes(user.role) ? user.role : null;
  const navMainItems = role ? sidebarMenuItems[role] : [];

  // User data for NavUser
  const userData = user
    ? {
        name: user.name || "User",
        email: user.email || "No email",
        avatar: user.image_url || "/avatars/default.jpg",
      }
    : { name: "Guest", email: "", avatar: "/avatars/default.jpg" };

  return (
    <Sidebar
      className="bg-[#4c35ae]"
      collapsible="offcanvas"
      {...props}
    >
      <SidebarHeader className="bg-[#4c35ae]">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="p-2 flex justify-center">
              {/* Replace system name with logo image */}
              <img
                src={Logo} // <-- your logo path here
                alt="Smart Voting System Logo"
                className="h-20 w-auto" // adjust size
              />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-[#4c35ae] text-[#ffffff] dark:text-[#e0f7fa]">
        <NavMain items={navMainItems} />
      </SidebarContent>
      <SidebarFooter className="bg-[#4c35ae]">
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
