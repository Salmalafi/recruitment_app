import React, { useRef, useEffect, useState } from 'react';
import { useThemeProvider } from '../utils/ThemeContext';

import { chartColors } from './ChartjsConfig';
import {
  Chart, LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip,
} from 'chart.js';
import 'chartjs-adapter-moment';

// Import utilities
import { tailwindConfig } from '../utils/Utils';

Chart.register(LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip);

function RealtimeChart({ data, width, height }) {
  const [chart, setChart] = useState(null);
  const canvasRef = useRef(null);
  const chartValueRef = useRef(null);
  const chartDeviationRef = useRef(null);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === 'dark';
  const { textColor, gridColor, tooltipTitleColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors;

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current;
    const newChart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        layout: {
          padding: 20,
        },
        scales: {
          y: {
            border: {
              display: false,
            },
            suggestedMin: 0,
            ticks: {
              maxTicksLimit: 5,
              color: darkMode ? textColor.dark : textColor.light,
            },
            grid: {
              color: darkMode ? gridColor.dark : gridColor.light,
            },
          },
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'MMM DD, YYYY',
              displayFormats: {
                day: 'MMM DD',
              },
            },
            border: {
              display: false,
            },
            grid: {
              display: false,
            },
            ticks: {
              autoSkipPadding: 48,
              maxRotation: 0,
              color: darkMode ? textColor.dark : textColor.light,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            titleFont: {
              weight: '600',
            },
            callbacks: {
              label: (context) => context.parsed.y,
            },
            titleColor: darkMode ? tooltipTitleColor.dark : tooltipTitleColor.light,
            bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
            backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
            borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
          },
        },
        interaction: {
          intersect: false,
          mode: 'nearest',
        },
        animation: false,
        maintainAspectRatio: false,
      },
    });
    setChart(newChart);
    return () => newChart.destroy();
  }, [data, darkMode]);

  useEffect(() => {
    if (!chart) return;

    const currentValue = data.datasets[0].data[data.datasets[0].data.length - 1];
    const previousValue = data.datasets[0].data[data.datasets[0].data.length - 2];
    const diff = ((currentValue - previousValue) / previousValue) * 100;
    chartValueRef.current.innerHTML = currentValue;
    chartDeviationRef.current.innerHTML = `${diff > 0 ? '+' : ''}${diff.toFixed(2)}%`;
    chartDeviationRef.current.style.backgroundColor = diff < 0 ? tailwindConfig().theme.colors.red[500] : tailwindConfig().theme.colors.green[500];
  }, [data]);

  useEffect(() => {
    if (!chart) return;

    if (darkMode) {
      chart.options.scales.x.ticks.color = textColor.dark;
      chart.options.scales.y.ticks.color = textColor.dark;
      chart.options.scales.y.grid.color = gridColor.dark;
      chart.options.plugins.tooltip.titleColor = tooltipTitleColor.dark;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;
    } else {
      chart.options.scales.x.ticks.color = textColor.light;
      chart.options.scales.y.ticks.color = textColor.light;
      chart.options.scales.y.grid.color = gridColor.light;
      chart.options.plugins.tooltip.titleColor = tooltipTitleColor.light;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;
    }
    chart.update('none');
  }, [currentTheme]);

  return (
    <React.Fragment>
      <div className="px-5 py-3">
        <div className="flex items-start">
          <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mr-2 tabular-nums">
            <span ref={chartValueRef}>0</span>
          </div>
          <div ref={chartDeviationRef} className="text-sm font-semibold text-white px-1.5 rounded-full"></div>
        </div>
      </div>
      <div className="grow">
        <canvas ref={canvasRef} width={width} height={height}></canvas>
      </div>
    </React.Fragment>
  );
}

export default RealtimeChart;


