import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; 
import OffersList from '../componenets/offersList';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import DropdownProfile from '../componenets/DropdownProfile'; 

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
        const offers = [
          {
            reference: 'REF001',
            title: 'Développeur Full Stack',
            contractType: 'CDI',
            location: 'Paris, France',
            MaxDate: '2024-08-12',
            description: 'Nous recherchons un développeur Full Stack passionné par les nouvelles technologies.',
          },
          {
            reference: 'REF002',
            title: 'Chef de Projet IT',
            contractType: 'CDI',
            location: 'Lyon, France',
            MaxDate: '2024-08-12',
            description: 'Gérez des projets innovants dans un environnement stimulant et dynamique.',
          },
          {
            reference: 'REF003',
            title: 'Chef de Projet IT',
            contractType: 'CDI',
            location: 'Lyon, France',
            MaxDate: '2024-09-12',
            description: 'Gérez des projets innovants dans un environnement stimulant et dynamique.',
          },
          {
            reference: 'REF004',
            title: 'Designer UI/UX',
            contractType: 'CDD',
            location: 'Marseille, France',
            MaxDate: '2024-08-12',
            description: 'Rejoignez notre équipe créative et participez à la conception d\'interfaces utilisateurs.',
          },
        ];

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
       
            <WelcomeBanner
             align="right"
             lastName={userData.lastName}
             firstName={userData.firstName}
             />

       
            <OffersList offers={offersWithExpiry} />
          </div>
        </main>

      </div>
    </div>
  );
}

export default Dashboard;


