
import React from 'react';
import Navbar from '../componenets/navbar';
import Footer from '../componenets/footer';

const About = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">À propos</h2>
        <p>Contenu à propos de l'entreprise...</p>
      </div>
      <Footer />
    </div>
  );
};

export default About;
