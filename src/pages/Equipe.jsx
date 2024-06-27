
import React from 'react';
import Navbar from '../componenets/navbar';
import Footer from '../componenets/footer';

const Equipe = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Notre Équipe</h2>
        <p>Contenu sur l'équipe...</p>
      </div>
      <Footer />
    </div>
  );
};

export default Equipe;
