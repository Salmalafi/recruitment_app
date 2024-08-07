import React, { useRef, useEffect, useState } from 'react';
import { Chart, LineController, LineElement, Filler, PointElement, LinearScale, CategoryScale, Tooltip } from 'chart.js';

// Register necessary Chart.js components
Chart.register(LineController, LineElement, Filler, PointElement, LinearScale, CategoryScale, Tooltip);

function MinimalChart({ data = { labels: [], datasets: [] }, width, height }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        plugins: {
          legend: {
            display: true
          },
          tooltip: {
            enabled: true
          }
        },
        scales: {
          x: {
            type: 'category',
            labels: data.labels,
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  return (
    <div style={{ backgroundColor: 'white', padding: '20px', border: '1px solid black' }}>
      <canvas ref={canvasRef} width={width} height={height} style={{ backgroundColor: 'white' }}></canvas>
    </div>
  );
}

export default MinimalChart;
