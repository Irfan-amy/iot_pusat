import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function LineChart({ chartData }) {
  return (
    <Line
      data={chartData}
      options={{
        maintainAspectRatio: false,
        // xAxes: {
        //   title: "time",
        //   gridThickness: 2,
        //   unit: "second",
        //   unitStepSize: 1,
        //   type: "time",
        // },
      }}
      width={"100%"}
      redraw={true}
    />
  );
}

export default LineChart;
