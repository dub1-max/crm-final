import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DashboardStatsProps {
  type?: 'donut' | 'pie';
}

export const DashboardStats = ({ type = 'donut' }: DashboardStatsProps) => {
  const data = {
    labels: ['In Progress', 'Completed', 'Pending', 'Cancelled'],
    datasets: [
      {
        data: [12, 19, 3, 5],
        backgroundColor: [
          '#3b82f6',
          '#22c55e',
          '#eab308',
          '#ef4444',
        ],
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

  return <Doughnut data={data} options={options} />;
};