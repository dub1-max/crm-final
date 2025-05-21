import { Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import useWorkspaceId from "@/hooks/use-workspace-id";

export function NavCustomers() {
  const location = useLocation();
  const workspaceId = useWorkspaceId();
  const pathname = location.pathname;
  const customersUrl = `/workspace/${workspaceId}/customers`;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Customers</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={customersUrl === pathname}>
            <Link to={customersUrl}>
              <Users className="h-4 w-4" />
              <span>All Customers</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
