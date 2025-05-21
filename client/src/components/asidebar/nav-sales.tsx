import { BarChart, FileText, Calculator, Receipt, ChevronDown, File } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useState } from "react";

export function NavSales() {
  const location = useLocation();
  const workspaceId = useWorkspaceId();
  const pathname = location.pathname;
  const [isOpen, setIsOpen] = useState(false);

  const salesRoutes = [
    {
      path: `/workspace/${workspaceId}/sales/proposals`,
      icon: FileText,
      label: 'Proposals'
    },
    {
      path: `/workspace/${workspaceId}/sales/estimates`,
      icon: Calculator,
      label: 'Estimates'
    },
    {
      path: `/workspace/${workspaceId}/sales/invoices`,
      icon: Receipt,
      label: 'Invoices'
    },
    {
      path: `/workspace/${workspaceId}/sales/payments`,
      icon: Receipt,
      label: 'Payments'
    }
  ];

  const isActive = salesRoutes.some(route => pathname === route.path);

  return (
    <>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setIsOpen(!isOpen)}
              className={`w-full ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <BarChart className="h-4 w-4 mr-2" />
                  <span>Sales</span>
                </div>
                <ChevronDown 
                  className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
                />
              </div>
            </SidebarMenuButton>
            {isOpen && (
              <div className="ml-4 mt-1 space-y-1">
                {salesRoutes.map((route) => (
                  <SidebarMenuItem key={route.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === route.path}
                    >
                      <Link 
                        to={route.path}
                        className="flex items-center pl-4 py-1.5 text-sm"
                      >
                        <route.icon className="h-4 w-4 mr-2" />
                        <span>{route.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </div>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === `/workspace/${workspaceId}/reports`}>
              <Link to={`/workspace/${workspaceId}/reports`} className="flex items-center">
                <BarChart className="h-4 w-4 mr-2" />
                <span>Reports</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}