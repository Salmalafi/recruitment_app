// src/components/Offer.jsx
import React from 'react';
import { MapPin, Briefcase, FileText, Calendar } from 'lucide-react';

const Offer = ({ reference, title, contractType, location, description, maxDate, expired }) => {
  return (
    <div className={`bg-customBlue rounded-xl shadow-xl p-6 mb-4 ${expired ? 'opacity-50' : 'hover:bg-hoverColor hover:animate-zoomin'}`}>
      <div className="w-full">
        <h2 className="text-xl font-bold mb-2 flex items-center">
          <Briefcase size={18} className="mr-2" /> {title}
        </h2>
        <p className="text-gray-700 mb-2 flex items-center">
          <strong>Référence :</strong> {reference}
        </p>
        <p className="text-gray-700 mb-2 flex items-center">
          <MapPin size={18} className="mr-2" /><strong>Lieu :</strong> {location}
        </p>
        <p className="text-gray-700 mb-2 flex items-center">
          <FileText size={18} className="mr-2" /><strong>Type de contrat :</strong> {contractType}
        </p>
        <p className="text-gray-700 mb-2 flex items-center">
          <Calendar size={18} className="mr-2" /><strong>Date Limite :</strong> {maxDate}
        </p>
        <p className="text-gray-700 mb-4">{description}</p>
        <div className="flex justify-center gap-3">
          {!expired ? (
            <>
              <button className="bg-buttonColor1 text-white px-4 py-2 rounded-full hover:bg-buttonColor2">Postuler</button>
              <button className="bg-buttonColor2 text-white px-4 py-2 rounded-full hover:bg-buttonColor1">Voir détails</button>
            </>
          ) : (
            <p className="text-red-500">Expiré</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Offer;







