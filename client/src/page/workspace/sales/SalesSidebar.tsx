import { FileText, ClipboardList, Receipt, File } from "lucide-react";
import { NavLink } from "react-router-dom";
import useWorkspaceId from "@/hooks/use-workspace-id";

export function SalesSidebar() {
  const workspaceId = useWorkspaceId();

  const salesLinks = [
    { 
      href: `/workspace/${workspaceId}/sales/proposals`, 
      icon: FileText, 
      label: "Proposals" 
    },
    { 
      href: `/workspace/${workspaceId}/sales/estimates`, 
      icon: ClipboardList, 
      label: "Estimates" 
    },
    { 
      href: `/workspace/${workspaceId}/sales/invoices`, 
      icon: Receipt, 
      label: "Invoices" 
    },
    { 
      href: `/workspace/${workspaceId}/sales/payments`, 
      icon: Receipt, 
      label: "Payments" 
    },
    { 
      href: `/workspace/${workspaceId}/contracts`, 
      icon: File, 
      label: "Contracts" 
    }
  ];

  return (
    <div className="space-y-1 py-2">
      {salesLinks.map((link) => (
        <NavLink
          key={link.href}
          to={link.href}
          className={({ isActive }) =>
            `flex items-center rounded-md px-3 py-2 text-sm font-medium ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted hover:text-foreground"
            }`
          }
        >
          <link.icon className="mr-2 h-4 w-4" />
          {link.label}
        </NavLink>
      ))}
    </div>
  );
} 