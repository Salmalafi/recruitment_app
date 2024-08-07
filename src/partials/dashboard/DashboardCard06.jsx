import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoughnutChart from '../../charts/DoughnutChart';
import { tailwindConfig } from '../../utils/Utils';

function DashboardCard06() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const users = response.data;

        // Process the data to count occurrences of each country
        const countryCount = users.reduce((acc, user) => {
          if (user.country && user.country.label) {
            const country = user.country.label; // Assuming user.country.label contains the country name
            if (acc[country]) {
              acc[country] += 1;
            } else {
              acc[country] = 1;
            }
          }
          return acc;
        }, {});

        // Sort countries by the number of users
        const sortedCountries = Object.entries(countryCount).sort((a, b) => b[1] - a[1]);

        // Get top countries and their counts
        const topCountries = sortedCountries.slice(0, 5); // Display top 5 countries
        const labels = topCountries.map(([country]) => country);
        const data = topCountries.map(([, count]) => count);

        // Define chart data
        setChartData({
          labels,
          datasets: [
            {
              label: 'Top Countries',
              data,
              backgroundColor: [
                tailwindConfig().theme.colors.indigo[500],
                tailwindConfig().theme.colors.blue[400],
                tailwindConfig().theme.colors.indigo[800],
                tailwindConfig().theme.colors.green[400],
                tailwindConfig().theme.colors.red[400],
              ],
              hoverBackgroundColor: [
                tailwindConfig().theme.colors.indigo[600],
                tailwindConfig().theme.colors.blue[500],
                tailwindConfig().theme.colors.indigo[900],
                tailwindConfig().theme.colors.green[500],
                tailwindConfig().theme.colors.red[500],
              ],
              borderWidth: 0,
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
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">Top Countries</h2>
      </header>
      <DoughnutChart data={chartData} width={389} height={260} />
    </div>
  );
}

export default DashboardCard06;
