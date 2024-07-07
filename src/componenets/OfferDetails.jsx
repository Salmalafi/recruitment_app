import React from 'react';
import { MapPin, Briefcase, FileText, Calendar } from 'lucide-react';

const OfferDetails = ({ offer, onClose }) => {
  const {
    reference,
    title,
    contractType,
    location,
    maxDate,
    jobDescription,
    profilCherche,
    whatWeOffer,
  } = offer;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg overflow-y-auto max-h-130 relative">
        <button
          className="absolute top-2 right-2 bg-white rounded-full p-2 hover:bg-gray-200"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-gray-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M14.293 5.293a1 1 0 011.414 1.414L11.414 12l4.293 4.293a1 1 0 01-1.414 1.414L10 13.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 12 4.293 7.707a1 1 0 011.414-1.414L10 10.586l4.293-4.293z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>
        <p className="text-gray-700 mb-2 flex items-center">
          <strong>Référence :</strong> {reference}
        </p>
        <p className="text-gray-700 mb-2 flex items-center">
          <MapPin size={18} className="mr-2" />
          <strong>Lieu :</strong> {location}
        </p>
        <p className="text-gray-700 mb-2 flex items-center">
          <FileText size={18} className="mr-2" />
          <strong>Type de contrat :</strong> {contractType}
        </p>
        <p className="text-gray-700 mb-2 flex items-center">
          <Calendar size={18} className="mr-2" />
          <strong>Date Limite :</strong> {maxDate}
        </p>
        <div className="text-gray-700 mb-4">{jobDescription}</div>
        <div className="text-gray-700 mb-4">{profilCherche}</div>
        <div className="text-gray-700 mb-4">{whatWeOffer}</div>
        <div className="flex justify-center gap-3">
          <button className="bg-buttonColor1 text-white px-4 py-2 rounded-full hover:bg-buttonColor2">
            Postuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferDetails;
