// import React from 'react';
import { Plus, Download, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ContractsStats } from "./contracts-stats";
import { ContractsTable } from "./contracts-table";
import { ContractsCharts } from "./contracts-charts";
import Reports from "./Reports";
import { Routes, Route } from "react-router-dom";

export function Contracts() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Contracts</h1>
      </div>
      
      <ContractsStats />
      
      <div className="flex items-center justify-between">
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Contract
        </Button>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search contracts..."
              className="pl-9 w-[300px]"
            />
          </div>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContractsCharts />
      </div>

      <ContractsTable />
    </div>
  );
}

export default function WorkspaceRoutes() {
  return (
    <Routes>
      <Route path="/workspace/:workspaceId/reports" element={<Reports />} />
    </Routes>
  );
}
