import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export function ContractsCharts() {
  const contractValueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Contract Value',
        data: [30000, 45000, 35000, 50000, 40000, 60000],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const contractStatusData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Active Contracts',
        data: [10, 12, 15, 14, 16, 15],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Pending Contracts',
        data: [5, 7, 6, 8, 7, 7],
        borderColor: 'rgb(234, 179, 8)',
        backgroundColor: 'rgba(234, 179, 8, 0.5)',
        tension: 0.3,
      },
    ],
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Contract Values</CardTitle>
          <CardDescription>Monthly contract values in USD</CardDescription>
        </CardHeader>
        <CardContent>
          <Bar
            data={contractValueData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
              },
            }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Contract Status Trends</CardTitle>
          <CardDescription>Monthly active vs pending contracts</CardDescription>
        </CardHeader>
        <CardContent>
          <Line
            data={contractStatusData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
              },
            }}
          />
        </CardContent>
      </Card>
    </>
  );
}
