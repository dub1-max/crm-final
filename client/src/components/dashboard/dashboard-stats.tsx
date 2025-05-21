import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DashboardStatsProps {
  type?: 'donut' | 'pie';
  data?: {
    labels: string[];
    values: number[];
    colors: string[];
  };
}

export const DashboardStats = ({ 
  type = 'donut',
  data = {
    labels: ['In Progress', 'Completed', 'Pending', 'Cancelled'],
    values: [12, 19, 3, 5],
    colors: [
      'hsl(var(--primary))',
      'hsl(var(--success))',
      'hsl(var(--warning))',
      'hsl(var(--destructive))'
    ],
  }
}: DashboardStatsProps) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: data.colors,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    cutout: type === 'donut' ? '70%' : 0,
  };

  return (
    <div className="w-full h-[300px] flex items-center justify-center">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}; 