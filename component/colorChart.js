import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const ColorChart = ({ products }) => {
  const getColorData = () => {
    const colorCount = products.reduce((acc, item) => {
      if (item.data?.color) {
        acc[item.data.color] = (acc[item.data.color] || 0) + 1;
      }
      return acc;
    }, {});

    return {
      labels: Object.keys(colorCount),
      datasets: [
        {
          label: "Number of Products",
          data: Object.values(colorCount),
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div style={{ width: "80%", maxWidth: "600px", margin: "auto" }}>
      <Bar
        data={getColorData()}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Product Distribution by colors",
            },
          },
        }}
      />
    </div>
  );
};

export default ColorChart;
