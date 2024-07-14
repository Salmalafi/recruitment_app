import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Icon from '../../images/icon-01.svg';
import EditMenu from '../../componenets/DropdownEditMenu';
import { StickyNote } from 'lucide-react';
function DashboardCard01() {
  const [totalApplications, setTotalApplications] = useState(0);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
        const response = await axios.get('http://localhost:3000/applications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTotalApplications(response.data.length); // Assuming response.data is an array of applications
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="flex flex-col  sm:col-span-6 h-40 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 p-4">
      <div className="px-2 pt-2">
        <header className="flex justify-between items-start mb-2">
          {/* Icon */}
          <StickyNote width="24" height="24" alt="Icon 01"  />
         
          {/* Menu button */}
          <EditMenu align="right" className="relative inline-flex">
            <li>
              <Link className="font-medium text-xs text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-2" to="#0">
                Option 1
              </Link>
            </li>
            <li>
              <Link className="font-medium text-xs text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-2" to="#0">
                Option 2
              </Link>
            </li>
            <li>
              <Link className="font-medium text-xs text-rose-500 hover:text-rose-600 flex py-1 px-2" to="#0">
                Remove
              </Link>
            </li>
          </EditMenu>
        </header>
        <h2 className="text-md font-semibold text-slate-800 dark:text-slate-100 mb-1">Total des candidatures</h2>
        <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1">candidatures</div>
        <div className="flex items-start">
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mr-1">{totalApplications}</div>
          <div className="text-xs font-semibold text-white px-1 bg-emerald-500 rounded-full">+49%</div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard01;
