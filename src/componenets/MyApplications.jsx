import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userEmail = localStorage.getItem('userEmail');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.post('http://localhost:3000/users/findByEmail', { email: userEmail });
        const userId = response.data._id;
        setUserId(userId);
      } catch (error) {
        setError('Error fetching user ID. Please try again.');
      }
    };

    if (userEmail && token) {
      fetchUserId();
    }
  }, [userEmail, token]);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/applications/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Set applications with offer data included
        const applicationsWithOffers = await Promise.all(
          response.data.map(async (application) => {
            try {
              const offerResponse = await axios.get(`http://localhost:3000/offers/${application.offerId}`, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
              const offer = offerResponse.data;
              return { ...application, offer };
            } catch (error) {
              console.error(`Error fetching offer ${application.offerId}:`, error);
              return { ...application, offer: null };
            }
          })
        );
        setApplications(applicationsWithOffers);
      } catch (error) {
        setError('Error fetching applications. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchApplications();
    }
  }, [userId, token]);

  const downloadFile = async (resumeUrl) => {
    try {
      const response = await axios.get(resumeUrl, {
        responseType: 'blob', // Ensure response type is blob for file download
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resume.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  if (!userEmail || !token) {
    return <p className="text-red-500">User email or token not found. Please login again.</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="font-sans overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="whitespace-nowrap">
          <tr>
            <th className="p-4 text-left text-sm font-semibold text-gray-800">Application N°</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-800">
              Status{' '}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 fill-gray-500 inline cursor-pointer ml-2" viewBox="0 0 401.998 401.998">
                <path
                  d="M73.092 164.452h255.813c4.949 0 9.233-1.807 12.848-5.424 3.613-3.616 5.427-7.898 5.427-12.847s-1.813-9.229-5.427-12.85L213.846 5.424C210.232 1.812 205.951 0 200.999 0s-9.233 1.812-12.85 5.424L60.242 133.331c-3.617 3.617-5.424 7.901-5.424 12.85 0 4.948 1.807 9.231 5.424 12.847 3.621 3.617 7.902 5.424 12.85 5.424zm255.813 73.097H73.092c-4.952 0-9.233 1.808-12.85 5.421-3.617 3.617-5.424 7.898-5.424 12.847s1.807 9.233 5.424 12.848L188.149 396.57c3.621 3.617 7.902 5.428 12.85 5.428s9.233-1.811 12.847-5.428l127.907-127.906c3.613-3.614 5.427-7.898 5.427-12.848 0-4.948-1.813-9.229-5.427-12.847-3.614-3.616-7.899-5.42-12.848-5.42z"
                  data-original="#000000"
                />
              </svg>
            </th>
            <th className="p-4 text-left text-sm font-semibold text-gray-800">Date of application</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-800">Resume</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-800">Offer</th>
          </tr>
        </thead>
        <tbody className="whitespace-nowrap">
          {applications.map((application, index) => (
            <tr key={application._id}>
              <td className="p-4 text-sm font-semibold text-gray-800">{index + 1}</td>
              <td className="p-4 text-sm font-semibold text-gray-800">
                <span className="w-[68px] block text-center py-1 border border-yellow-500 text-yellow-600 rounded text-xs">{application.status}</span>
              </td>
              <td className="p-4 text-sm font-semibold text-gray-800">{application.date}</td>
              <td className="p-4 text-sm font-semibold text-gray-800">
                <div className="flex items-center">
                  <Viewer
                    fileUrl={`http://localhost:3000/applications/resume/${application.resume}`}
                    httpHeaders={{ Authorization: `Bearer ${token}` }}
                    defaultScale={0.05}
                    hideRotation
                  />
                  <div className='w-2'></div>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 ml-4 text-white h-8 w-20 font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => downloadFile(`http://localhost:3000/applications/resume/${application.resume}`)}
                  >
                    Download
                  </button>
                </div>
              </td>
              <td className="p-4 text-sm font-semibold text-gray-800">{application.offer ? application.offer.title : 'Offer Not Found'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyApplications;

