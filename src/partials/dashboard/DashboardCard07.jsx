import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

function DashboardCard07() {
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('http://localhost:3000/applications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const applicationsData = await Promise.all(response.data.map(async (application) => {
          const userResponse = await axios.get(`http://localhost:3000/users/${application.userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const offerResponse = await axios.get(`http://localhost:3000/offers/${application.offerId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          return {
            ...application,
            userName: `${userResponse.data.lastName} ${userResponse.data.firstName}`,
            offerReference: offerResponse.data.reference,
            applicationDate: new Date(application.date),
          };
        }));

        // Sort applications by date in descending order and limit to the latest 20 applications
        applicationsData.sort((a, b) => b.applicationDate - a.applicationDate);
        const latestApplications = applicationsData.slice(0, 20);

        setApplications(latestApplications);
      } catch (error) {
        console.error('Error fetching applications', error);
      }
    };

    fetchApplications();
  }, [token]);

  const handleDownloadResume = (resumeUrl) => {
    window.open(resumeUrl, '_blank');
  };

  return (
    <div className="col-span-full xl:col-span-8 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">Latest Applications</h2>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-slate-300">
            {/* Table header */}
            <thead className="text-xs uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-sm">
              <tr>
                <th className="p-2 text-left">
                  <div className="font-semibold">Date</div>
                </th>
                <th className="p-2 text-left">
                  <div className="font-semibold">User</div>
                </th>
                <th className="p-2 text-center">
                  <div className="font-semibold">Offer</div>
                </th>
                <th className="p-2 text-center">
                  <div className="font-semibold">Resume</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium divide-y divide-slate-100 dark:divide-slate-700 max-h-96 overflow-y-auto">
              {applications.map((application) => (
                <tr key={application.id}>
                  <td className="p-2 text-left">
                    <div className="text-slate-800 dark:text-slate-100">
                      {formatDistanceToNow(application.applicationDate, { addSuffix: true })}
                    </div>
                  </td>
                  <td className="p-2 text-left">
                    <div className="flex items-center">
                      <div className="text-slate-800 dark:text-slate-100">{application.userName}</div>
                    </div>
                  </td>
                  <td className="p-2 text-center">
                    <div className="text-slate-800 dark:text-slate-100">{application.offerReference}</div>
                  </td>
                  <td className="p-2 text-center">
                    <div className="text-slate-800 dark:text-slate-100">
                      <button
                        className="bg-buttonColor2 hover:bg-blue-700 text-gray-900 h-8 w-20 font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                        onClick={() => handleDownloadResume(`http://localhost:3000/applications/resume/${application.resume}`)}
                      >
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard07;

