// src/components/app-sidebar.jsx
import * as React from "react";
import { IconInnerShadowTopLeft } from "@tabler/icons-react";
import { NavMain } from "@/components/nav-main";
import { Link } from "react-router-dom";
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
      className="bg-[#4c35ae]" // Changed: Lighter blue, darker blue for dark mode
      collapsible="offcanvas"
      {...props}
    >
      <SidebarHeader className="bg-[#4c35ae]">
        <SidebarMenu>
          <SidebarMenuItem>
            <div  className="p-2">
              <h1
                className="flex mb-5 items-center gap-2 hover:text-[#ffffff] transition-colors" // Changed: Hover effect
              >
                <IconInnerShadowTopLeft className="h-5 w-5 text-[#ffffff]" /> {/* Changed: White icon */}
                <span className="text-base text-[#ffffff] font-semibold">
                  Smart Voting System
                </span>
              </h1>
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