import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaEnvelope, FaPhone, FaBriefcase } from 'react-icons/fa';
import Avatar from './Avatar'; 

const UserInfo = ({ user, onClose }) => {
  const [activeSection, setActiveSection] = useState('ContactDetails');
  const [jobOffers, setJobOffers] = useState([]);
  const [applications, setApplications] = useState([]);

  if (!user) return null;

  const token = localStorage.getItem('token');
  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    if (activeSection === 'JobOffers') {
      const fetchJobOffers = async () => {
        try {
          const { data: applicationsData } = await axiosInstance.get(`http://localhost:3000/applications/user/${user._id}`);
          setApplications(applicationsData);
          const offerPromises = applicationsData.map(app => axiosInstance.get(`http://localhost:3000/offers/${app.offerId}`));
          const offers = await Promise.all(offerPromises);
          const offersWithApplications = offers.map((response, index) => ({
            ...response.data,
            applicationDate: applicationsData[index].date,
          }));
          setJobOffers(offersWithApplications);
        } catch (error) {
          console.error('Error fetching job offers:', error);
        }
      };
      fetchJobOffers();
    }
  }, [activeSection, user._id, axiosInstance]);

  const getDateDifference = (date) => {
    const today = new Date();
    const applicationDate = new Date(date);
    const diffTime = Math.abs(today - applicationDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return `il y a ${diffDays} jours`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-full max-w-lg mx-4 sm:max-w-sm md:max-w-sm lg:max-w-lg xl:max-w-lg bg-white shadow-lg rounded-lg text-gray-900 relative min-h-[400px] flex flex-col">
     
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
          onClick={onClose}
        >
          <FaTimes />
        </button>

     
        <div className="flex-1 flex flex-col p-4">
   
          <div className="flex flex-col items-center">
            <div className="rounded-t-lg h-36 overflow-hidden mb-4">
              <img
                className="object-cover object-top w-full"
                src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
                alt="Mountain"
              />
            </div>
           
            <div className="w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden mb-4 flex items-center justify-center bg-gray-200">
              <Avatar name={user.firstName} />
            </div>
         
            <div className="flex justify-center space-x-2 mb-4">
              <button
                type="button"
                className={`px-4 py-2 text-white text-sm font-semibold border-none rounded-lg ${activeSection === 'ContactDetails' ? 'bg-customPurple' : 'bg-gray-400'} hover:bg-blue-700`}
                onClick={() => setActiveSection('ContactDetails')}
              >
                Contact Details
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-white text-sm font-semibold border-none rounded-lg ${activeSection === 'JobOffers' ? 'bg-customPurple' : 'bg-gray-400'} hover:bg-green-700`}
                onClick={() => setActiveSection('JobOffers')}
              >
                Job offers applied
              </button>
            </div>
          </div>
          <div className="flex-1">
            {activeSection === 'ContactDetails' && (
              <div className="flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-semibold mb-2">{user.firstName} {user.lastName}</h2>
                <p className="text-gray-500 mb-2"><FaEnvelope className="inline-block mr-1" /> {user.email}</p>
                <p className="text-gray-500"><FaPhone className="inline-block mr-1" /> {user.phone}</p>
              </div>
            )}
            {activeSection === 'JobOffers' && (
              <div className="p-4 flex flex-col overflow-y-auto max-h-[300px]">
                {jobOffers.length > 0 ? (
                  <ul>
                    {jobOffers.map((offer) => (
                      <li key={offer._id} className="mb-4">
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                          <h4 className="text-lg font-semibold mb-1">{offer.title}</h4>
                          <p className="text-gray-600 mb-2"><FaBriefcase className="inline-block mr-1" /> {offer.reference}</p>
                          <p className="text-gray-500">{getDateDifference(offer.applicationDate)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No job offers found.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
