// src/utils/AverageChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register the components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AverageChart = ({ results }) => {
  console.log("Average Chart Results:", results);
  
  const labels = results.map(result => result.name);
  const avgTurnaroundTimes = results.map(result => result.averages.avgTurnaroundTime);
  const avgWaitingTimes = results.map(result => result.averages.avgWaitingTime);

  const data = {
    labels,
    datasets: [
      {
        label: 'Average Turnaround Time',
        data: avgTurnaroundTimes,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Average Waiting Time',
        data: avgWaitingTimes,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default AverageChart;