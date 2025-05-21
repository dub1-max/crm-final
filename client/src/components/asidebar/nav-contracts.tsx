import { FileText } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import useWorkspaceId from "@/hooks/use-workspace-id";

export function NavContracts() {
  const location = useLocation();
  const workspaceId = useWorkspaceId();
  const pathname = location.pathname;

  const contractsPath = `/workspace/${workspaceId}/contracts`;
  const isActive = pathname === contractsPath;

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={isActive}
          >
            <Link 
              to={contractsPath}
              className="flex items-center"
            >
              <FileText className="h-4 w-4 mr-2" />
              <span>Contracts</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
