import {
  BarChart3,
  Users,
  FileText,
  Receipt,
  ClipboardList,
  File,
  ChevronDown,
} from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SidebarNav() {
  const [isSalesOpen, setSalesOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <SidebarItem icon={BarChart3} href="/dashboard" label="Dashboard" />
      <SidebarItem icon={Users} href="/customers" label="Customers" />
      
      {/* Sales Section with Dropdown */}
      <Collapsible
        open={isSalesOpen}
        onOpenChange={setSalesOpen}
        className="space-y-2"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-between px-4 hover:bg-muted",
              isSalesOpen && "bg-muted"
            )}
          >
            <div className="flex items-center">
              <Receipt className="mr-2 h-4 w-4" />
              <span>Sales</span>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isSalesOpen && "rotate-180"
              )}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-6 space-y-2">
          <SidebarItem
            icon={FileText}
            href="/sales/proposals"
            label="Proposals"
          />
          <SidebarItem
            icon={ClipboardList}
            href="/sales/estimates"
            label="Estimates"
          />
          <SidebarItem
            icon={Receipt}
            href="/sales/invoices"
            label="Invoices"
          />
          <SidebarItem
            icon={File}
            href="/sales/contracts"
            label="Contracts"
          />
          <SidebarItem
            icon={Receipt}
            href="/sales/payments"
            label="Payments"
          />
        </CollapsibleContent>
      </Collapsible>

      {/* Other sidebar items */}
    </div>
  );
} 