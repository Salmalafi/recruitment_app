// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route,useNavigate, useLocation, Routes } from 'react-router-dom';
import './css/style.css';
import './charts/ChartjsConfig';
import recrutementImage from './assets/recrutement2.jpg';
import Dashboard from './pages/Dashboard';
import SignUp from './pages/signup';
import Login from './pages/login';
import Navbar from './componenets/navbar';
import Footer from './componenets/footer';
import OffersList from './componenets/offersList';
import Equipe from './pages/Equipe';
import About from './pages/About';
import SignInWithLinkedIn from './componenets/singinwithLinkedin';
import MyApplications from './componenets/MyApplications';
import * as PDFJS from 'pdfjs-dist'
import 'pdfjs-dist/web/pdf_viewer.css';
import ForgotPasswordStepper from './componenets/ForgotPasswordStepper';
import DashboardHR from './pages/DashboardHR';
import Testimonials from './componenets/testimonals';
import DashboardAdmin from './pages/DashboardAdmin';
PDFJS.GlobalWorkerOptions.workerSrc ='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';


const App = () => {
  const currentDate = new Date();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto';
    window.scroll({ top: 0 });
    document.querySelector('html').style.scrollBehavior = '';
  }, [location.pathname]); 
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
        <Routes>
        
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/dashboardHR/*" element={<DashboardHR/>} />
          <Route path="/dashboardAdmin/*" element={<DashboardAdmin/>} />
          <Route path="/" element={
            <>
              <Navbar /> 
              <main className="main-content container mx-auto mt-16">
                <div className="relative">
                  <img src={recrutementImage} alt="Recrutement" className="w-full object-cover shadow-md" style={{ height: '350px' }} />
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center bg-black bg-opacity-50 rounded-lg">
                    <h1 className="text-4xl font-bold mb-4">Trouvez votre prochaine opportunité</h1>
                    <p className="text-lg mb-8">Découvrez nos offres d'emploi disponibles dès maintenant</p>
                    <div className="space-x-4">
                      <button className="bg-buttonColor3 hover:bg-blue-600 text-white px-6 py-3 rounded-lg">Explorer les offres</button>
                      <button className="bg-buttonColor4 hover:bg-gray-900 text-white px-6 py-3 rounded-lg">Candidature spontanée</button>
                    </div>
                  </div>
                </div>
                <OffersList offers={offersWithExpiry} />
              </main>
              <Footer />
            </>
          } />

          <Route path="/signinwithlinkedin" element={<SignInWithLinkedIn />} />
          <Route path="/equipe" element={<Equipe />} />
          <Route path="/about" element={<About />} />
          <Route path="/testimonals" element={<Testimonials/>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/resetpassword" element={<>
            <Navbar />
            <ForgotPasswordStepper />
            <Footer />
            </>
            } />
                 <Route path="/reset-password/*" element={<>
            <Navbar />
            <ForgotPasswordStepper />
            <Footer />
            </>
            } /> 
          <Route path="/login" element={
            <>
              <Navbar />
              <Login />
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
