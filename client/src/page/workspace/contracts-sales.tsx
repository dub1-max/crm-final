import * as React from "react";
import { Card } from "@/components/ui/card";

export function ContractsStats() {
  const stats = [
    { label: "Active", count: 12, color: "text-blue-500" },
    { label: "Expired", count: 0, color: "text-red-500" },
    { label: "About to Expire", count: 7, color: "text-yellow-500" },
    { label: "Recently Added", count: 13, color: "text-green-500" },
    { label: "Trash", count: 0, color: "text-gray-500" },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {stats.map((stat) => (
        <Card key={stat.label} className="flex-1 p-4 min-w-[200px]">
          <div className="flex flex-col">
            <span className={`text-2xl font-bold ${stat.color}`}>
              {stat.count}
            </span>
            <span className="text-sm text-muted-foreground">{stat.label}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
