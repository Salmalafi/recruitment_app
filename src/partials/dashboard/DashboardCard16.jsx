import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Tooltip from '../../componenets/Tooltip';
import RealtimeChart from '../../charts/RealtimeChart';
import { tailwindConfig, hexToRGB } from '../../utils/Utils';

function DashboardCard16() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/applications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const users = response.data;
t
        const groupedByDate = users.reduce((acc, user) => {
          const date = new Date(user.date); 
          const formattedDate = date.toISOString().split('T')[0]; 

          acc[formattedDate] = (acc[formattedDate] || 0) + 1;
          return acc;
        }, {});

        const labels = Object.keys(groupedByDate).sort();
        const data = labels.map(label => groupedByDate[label]);

        setChartData({
          labels,
          datasets: [
            {
              data,
              fill: true,
              backgroundColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.blue[500])}, 0.08)`,
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
        setLoading(false);
      } catch (error) {
        setError('Error fetching users');
        setLoading(false);
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">Applications received per Day</h2>
       
      </header>
      <div className="p-5">
        <RealtimeChart data={chartData} width={595} height={248} />
      </div>
    </div>
  );
}

export default DashboardCard16;
