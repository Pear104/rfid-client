import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChart = ({ data, label }) => {
  const chartData = {
    labels: label,
    datasets: [
      {
        label: "Worked hours",
        data: data,
        borderWidth: "5px",
        borderColor: "black",
        backgroundColor: "green",
      },
    ],
  };
  return <Bar data={chartData} options={{}} />;
};

export default BarChart;
