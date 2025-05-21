import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileCheck, FileText, FileClock, AlertCircle } from "lucide-react";
import { Contract } from "./contracts-table";
import { useMemo } from "react";

interface ContractsStatsProps {
  contracts: Contract[];
}

export function ContractsStats({ contracts }: ContractsStatsProps) {
  // Calculate contract statistics
  const stats = useMemo(() => {
    // Current date for calculations
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    // Previous month for comparison
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);
    const lastMonthStr = lastMonth.toISOString().split('T')[0];
    
    // Calculate total contracts
    const totalContracts = contracts.length;
    
    // Calculate active contracts
    const activeContracts = contracts.filter(c => c.status === "active").length;
    
    // Calculate pending review (placeholder - assuming contracts with "draft" status are pending review)
    const pendingReviewContracts = contracts.filter(c => c.status === "draft").length;
    
    // Calculate expiring soon - contracts expiring within 30 days
    const expiringSoon = contracts.filter(c => {
      const endDate = new Date(c.endDate);
      return c.status === "active" && endDate > today && endDate <= thirtyDaysFromNow;
    }).length;
    
    // Calculate changes from last month (simulated)
    // In a real app, you would compare with actual historical data
    const newContractsLastMonth = contracts.filter(c => {
      const startDate = new Date(c.startDate);
      return startDate >= lastMonth && startDate <= today;
    }).length;
    
    // Random values for demonstration
    // In a real app, these would be calculated from historical data
    const activeChangeLastMonth = Math.floor(Math.random() * 3) + 1;
    const pendingChangeLastMonth = Math.floor(Math.random() * 4) + 1;
    
    return {
      total: totalContracts,
      active: activeContracts,
      pending: pendingReviewContracts,
      expiring: expiringSoon,
      totalChange: newContractsLastMonth,
      activeChange: activeChangeLastMonth,
      pendingChange: pendingChangeLastMonth
    };
  }, [contracts]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            +{stats.totalChange} from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
          <FileCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.active}</div>
          <p className="text-xs text-muted-foreground">
            +{stats.activeChange} from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          <FileClock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pending}</div>
          <p className="text-xs text-muted-foreground">
            +{stats.pendingChange} from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.expiring}</div>
          <p className="text-xs text-muted-foreground">
            Expires within 30 days
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
