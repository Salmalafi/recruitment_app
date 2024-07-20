import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {LoaderCircle } from 'lucide-react';
import EditMenu from '../../componenets/DropdownEditMenu';

function DashboardCard04() {
  const [pendingApplicationsCount, setPendingApplicationsCount] = useState(0);

  useEffect(() => {
    const fetchPendingApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/applications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const pendingApplications = response.data.filter(app => app.status === 'PENDING');

        setPendingApplicationsCount(pendingApplications.length);
      } catch (error) {
        console.error('Error fetching pending applications:', error);
      }
    };

    fetchPendingApplications();
  }, []);

  return (
    <div className="flex flex-col col-span-full h-40 sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          {/* Icon */}
          <LoaderCircle size={24} strokeWidth={1.5}  width="32" height="32" alt="Icon 03" />  
          {/* Menu button */}
          <EditMenu align="right" className="relative inline-flex">
            <li>
              <Link className="font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-3" to="#0">
                Option 1
              </Link>
            </li>
            <li>
              <Link className="font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-3" to="#0">
                Option 2
              </Link>
            </li>
            <li>
              <Link className="font-medium text-sm text-rose-500 hover:text-rose-600 flex py-1 px-3" to="#0">
                Remove
              </Link>
            </li>
          </EditMenu>
        </header>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Nombre de candidatures en attente </h2>
        <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1">Candidatures en attente</div>
        <div className="flex items-start">
          <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mr-2">{pendingApplicationsCount}</div>
       
          { /* <div className="text-xs font-semibold text-white px-1 bg-emerald-500 rounded-full">+49%</div> */}
        </div>
      </div>
    
    </div>
  );
}

export default DashboardCard04;

