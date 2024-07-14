import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Tooltip from '../../componenets/Tooltip';
import RealtimeChart from '../../charts/RealtimeChart';
import { tailwindConfig } from '../../utils/Utils';

function DashboardCard05() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/applications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const applications = response.data;

        // Convert and format dates for chart
        const groupedByDate = applications.reduce((acc, app) => {
          const date = new Date(app.date); // Parse the UTC date
          const formattedDate = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
            timeZone: 'UTC',
          }).format(date);

          acc[formattedDate] = (acc[formattedDate] || 0) + 1;
          return acc;
        }, {});

        const labels = Object.keys(groupedByDate);
        const data = Object.values(groupedByDate);

        setChartData({
          labels,
          datasets: [
            {
              data,
              fill: true,
              backgroundColor: `rgba(${tailwindConfig().theme.colors.blue[500]}, 0.08)`,
              borderColor: tailwindConfig().theme.colors.indigo[500],
              borderWidth: 2,
              tension: 0,
              pointRadius: 0,
              pointHoverRadius: 3,
              pointBackgroundColor: tailwindConfig().theme.colors.indigo[500],
              pointHoverBackgroundColor: tailwindConfig().theme.colors.indigo[500],
              pointBorderWidth: 0,
              pointHoverBorderWidth: 0,
              clip: 20,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, []);

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">New Applications per Day</h2>
        <Tooltip className="ml-2">
          <div className="text-xs text-center whitespace-nowrap">Built with <a className="underline" href="https://www.chartjs.org/" target="_blank" rel="noreferrer">Chart.js</a></div>
        </Tooltip>
      </header>
      <RealtimeChart data={chartData} width={595} height={248} />
    </div>
  );
}

export default DashboardCard05;


