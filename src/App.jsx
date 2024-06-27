// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';



import recrutementImage from './assets/recrutement2.jpg';

import SignUp from './pages/signup';
import Login from './pages/login';
import Navbar from './componenets/navbar';
import Footer from './componenets/footer';
import OffersList from './componenets/offersList';
import Equipe from './pages/Equipe';
import About from './pages/About';

const App = () => {
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

  return (
    <Router>
      <div className="app">
        <Navbar></Navbar>
        <main className="main-content container mx-auto mt-16"> 
          <Routes>
            <Route path="/" element={
              <>
                <div className="relative">
                  <img src={recrutementImage} alt="Recrutement" className="w-full object-cover shadow-md" style={{ height: '350px' }} />
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center bg-black bg-opacity-50 rounded-lg">
                    <h1 className="text-4xl font-bold mb-4">Trouvez votre prochaine opportunité</h1>
                    <p className="text-lg mb-8">Découvrez nos offres d'emploi disponibles dès maintenant</p>
                    <div className="space-x-4">
                      <button className="bg-buttonColor3 hover:bg-blue-600 text-white px-6 py-3 rounded-lg">Explorer les offres</button>
                      <button className="bg-buttonColor4 hover:bg-gray-900 text-white px-6 py-3 rounded-lg">Candidature spontannée</button>
                    </div>
                  </div>
                </div>
                <OffersList offers={offersWithExpiry} />
              </>
            } />
            <Route path="/equipe" element={<Equipe />} />
            <Route path="/about" element={<About />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
    <Footer></Footer>
      </div>
    </Router>
  );
};

export default App;
