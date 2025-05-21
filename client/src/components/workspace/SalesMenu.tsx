import { FileText, ClipboardList, Receipt, File } from "lucide-react";
import { Link } from "react-router-dom";
import useWorkspaceId from "@/hooks/use-workspace-id";

export function SalesMenu() {
  const workspaceId = useWorkspaceId();
  
  return (
    <div className="flex flex-col space-y-1 my-2">
      <Link 
        to={`/workspace/${workspaceId}/sales/proposals`}
        className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
      >
        <FileText className="h-4 w-4 mr-2" />
        <span>Proposals</span>
      </Link>
      
      <Link 
        to={`/workspace/${workspaceId}/sales/estimates`}
        className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
      >
        <ClipboardList className="h-4 w-4 mr-2" />
        <span>Estimates</span>
      </Link>
      
      <Link 
        to={`/workspace/${workspaceId}/sales/invoices`}
        className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
      >
        <Receipt className="h-4 w-4 mr-2" />
        <span>Invoices</span>
      </Link>
      
      <Link 
        to={`/workspace/${workspaceId}/sales/payments`}
        className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 rounded-md font-medium"
      >
        <Receipt className="h-4 w-4 mr-2" />
        <span>Payments</span>
      </Link>
      
      <Link 
        to={`/workspace/${workspaceId}/contracts`}
        className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
      >
        <File className="h-4 w-4 mr-2" />
        <span>Contracts</span>
      </Link>
    </div>
  );
} 