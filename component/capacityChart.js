import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
);

const CapacityChart = ({ products }) => {
  const getCapacityData = () => {
    const capacityCount = products.reduce((acc, item) => {
      if (item.data?.capacity) {
        acc[item.data.capacity] = (acc[item.data.capacity] || 0) + 1;
      }
      return acc;
    }, {});

    return {
      labels: Object.keys(capacityCount),
      datasets: [
        {
          label: "Number of Products by Capacity",
          data: Object.values(capacityCount),
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div style={{ width: "80%", maxWidth: "400px", margin: "auto" }}>
      <Pie
        data={getCapacityData()}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Product Distribution by Capacities",
            },
          },
        }}
      />
    </div>
  );
};

export default CapacityChart;
