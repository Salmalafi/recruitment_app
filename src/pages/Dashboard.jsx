import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import OffersList from '../componenets/offersList'; // Update path as per your project structure
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import MyApplications from '../componenets/MyApplications'; // Update path as per your project structure
import { Route, Routes } from 'react-router-dom';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [offersWithExpiry, setOffersWithExpiry] = useState([]);
  const [userData, setUserData] = useState({});

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
        console.log('Fetched User Data:', fetchedUserData);

        const currentDate = new Date();
        const offersWithExpiry = offers.map(offer => {
          const maxDate = new Date(offer.MaxDate);
          return {
            ...offer,
            expired: currentDate > maxDate,
          };
        });

        setOffersWithExpiry(offersWithExpiry);

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    console.log('User Data:', userData);
  }, [userData]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <WelcomeBanner align="right" lastName={userData.lastName} firstName={userData.firstName} />
           
            <Routes>
              <Route path="/" element={<OffersList offers={offersWithExpiry} />} />
              <Route exact path="/myapplications" element={<MyApplications />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;


