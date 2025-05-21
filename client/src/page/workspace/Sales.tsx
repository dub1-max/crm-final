import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import useWorkspaceId from "@/hooks/use-workspace-id";

const Sales = () => {
  const navigate = useNavigate();
  const workspaceId = useWorkspaceId();

  const salesItems = [
    {
      title: "Proposals",
      description: "Create and manage sales proposals",
      path: `/workspace/${workspaceId}/sales/proposals`,
    },
    {
      title: "Estimates",
      description: "Create and manage estimates",
      path: `/workspace/${workspaceId}/sales/estimates`,
    },
    {
      title: "Invoices",
      description: "Create and manage invoices",
      path: `/workspace/${workspaceId}/sales/invoices`,
    },
    {
      title: "Payments",
      description: "Manage and track payment records",
      path: `/workspace/${workspaceId}/sales/payments`,
    },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold tracking-tight">Sales Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {salesItems.map((item) => (
          <Card key={item.title} className="cursor-pointer hover:bg-accent/50" onClick={() => navigate(item.path)}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
};

export default Sales;