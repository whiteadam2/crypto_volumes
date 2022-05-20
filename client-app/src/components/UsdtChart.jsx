import React, { useState, useEffect } from "react";
import { getData, parseISODate } from "../utils";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function UsdtChart() {
  const [title, setTitle] = useState("Loading...");
  const [labels, setLabels] = useState([]);
  const [usdtIn, setUsdtIn] = useState([]);
  const [usdtOut, setUsdtOut] = useState([]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "USDT",
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "in",
        data: usdtIn,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "out",
        data: usdtOut,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  useEffect(() => {
    async function wrapper() {
      const result = await getData();

      setUsdtIn(result.data.map((item) => item.usdt_in));
      setUsdtOut(result.data.map((item) => item.usdt_out));
      setLabels(result.data.map((item) => parseISODate(item.created_at).time));
      setTitle(parseISODate(result.data[0].created_at).day);
    }

    wrapper();
  }, []);

  return <Bar options={options} data={data} />;
}
