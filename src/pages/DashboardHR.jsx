import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Make sure you have installed jwt-decode library
import axios from 'axios'; // Make sure you have installed axios library

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import AddOfferForm from '../componenets/AddOfferForm';
import DashboardCard01 from '../partials/dashboard/DashboardCard01';
import DashboardCard02 from '../partials/dashboard/DashboardCard02';
import DashboardCard03 from '../partials/dashboard/DashboardCard03';
import DashboardCard04 from '../partials/dashboard/DashboardCard04';
import DashboardCard05 from '../partials/dashboard/DashboardCard05';
import DashboardCard06 from '../partials/dashboard/DashboardCard06';
import DashboardCard07 from '../partials/dashboard/DashboardCard07';
import DashboardCard08 from '../partials/dashboard/DashboardCard08';
import DashboardCard09 from '../partials/dashboard/DashboardCard09';
import DashboardCard10 from '../partials/dashboard/DashboardCard10';

import { Route, Routes } from 'react-router-dom';
import EditOfferForm from '../componenets/EditOffer';
import OffersList from '../componenets/offersList';
import Applications from '../componenets/Applications';

function DashboardHR() {
  const [userData, setUserData] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [offersWithExpiry, setOffersWithExpiry] = useState([]);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);

        console.log('Decoded Token:', decodedToken);

        const userResponse = await axios.post('http://localhost:3000/users/findByEmail', {
          email: decodedToken.email,
        });

        const fetchedUserData = userResponse.data;
        setUserData(fetchedUserData);
        const currentDate = new Date();
        const offersWithExpiry = offers.map(offer => {
          const maxDate = new Date(offer.MaxDate);
          return {
            ...offer,
            expired: currentDate > maxDate,
          };
        });

        setOffersWithExpiry(offersWithExpiry);
        console.log('Fetched User Data:', fetchedUserData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Welcome banner */}
            <WelcomeBanner align="right" role={userData.role} lastName={userData.lastName} firstName={userData.firstName} />

            {/* Routes */}
            <Routes>
              {/* Route for dashboard cards */}
              <Route path="/" element={
                <div className="grid grid-cols-12 gap-6">
                  <DashboardCard01 />
                  <DashboardCard02 />
                  <DashboardCard03 />
                  <DashboardCard04 />
                  <DashboardCard05 />
                  <DashboardCard06 />
                  <DashboardCard07 />
                  <DashboardCard08 />
                  <DashboardCard09 />
                  <DashboardCard10 />
                </div>
              } />

              {/* Route for Add Offer Form */}
              <Route path="/addoffer" element={<AddOfferForm />} />
              <Route path="/offers" element={<OffersList offers={offersWithExpiry} />} />
              <Route path="/edit/:id" element={<EditOfferForm/>} />
              <Route path="/applications/:id" element={<Applications/>} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardHR;


