// src/components/site-header.jsx
import { useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { sidebarMenuItems, validRoles } from "@/utils/SidebarMenuitem";

export function SiteHeader() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Get the user's role, fallback to null if no user or invalid role
  const role = user?.role && validRoles.includes(user.role) ? user.role : null;
  const menuItems = role ? sidebarMenuItems[role] : [];

  // Function to generate breadcrumb items based on the current path
  const getBreadcrumbs = () => {
    const path = location.pathname;
    const breadcrumbs = [{ title: "Home", url: "/" }];

    // Find matching menu item for the current path
    const activeMenuItem = menuItems.find((item) => path === item.url || path.startsWith(item.url));

    if (activeMenuItem) {
      // Split the path to handle nested routes
      const pathSegments = path.split("/").filter((segment) => segment);

      // For each segment, find corresponding menu item or construct breadcrumb
      let currentPath = "";
      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        const menuItem = menuItems.find((item) => item.url === currentPath);
        if (menuItem) {
          breadcrumbs.push({
            title: menuItem.title,
            url: menuItem.url,
          });
        } else if (index === pathSegments.length - 1) {
          // Last segment, use as BreadcrumbPage if no menu item found
          breadcrumbs.push({
            title: segment.charAt(0).toUpperCase() + segment.slice(1),
            url: null,
          });
        }
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="flex h-[60px] shrink-0 items-center gap-2 border-b">
      <div className="flex w-full items-center gap-2 px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <BreadcrumbItem key={crumb.url || crumb.title}>
                {crumb.url ? (
                  <BreadcrumbLink asChild>
                    <Link to={crumb.url}>{crumb.title}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                )}
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}