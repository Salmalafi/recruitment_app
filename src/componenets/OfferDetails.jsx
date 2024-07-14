import React, { useState, useEffect } from 'react';
import { MapPin, Briefcase, FileText, Calendar, SquareCheck } from 'lucide-react';
import axios from 'axios';

const OfferDetails = ({ offer, onClose }) => {
  const {
    _id,
    reference,
    title,
    contractType,
    location,
    maxDate,
    jobDescription,
    profilCherche,
    whatWeOffer,
    skillsRequired,
    experience
  } = offer;

  const [applied, setApplied] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        const response = await axios.post('http://localhost:3000/users/findByEmail', { email: userEmail });
        if (response.data && response.data._id && response.data.role) {
          const userId = response.data._id;
          const userRole = response.data.role;
          setUserRole(userRole);

          if (userRole === 'Candidate') {
            fetchUserApplications(userId);
          }
        } else {
          console.error('User not found or missing _id or role in response');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const fetchUserApplications = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/applications/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const userApplications = response.data;
      const appliedToThisOffer = userApplications.some(app => app.offerId === _id);
      setApplied(appliedToThisOffer);
    } catch (error) {
      console.error('Error fetching user applications:', error);
    }
  };

  const handleCheckApplication = () => {
   
    console.log('Navigate to check application page');
  };

  const handleApply = () => {
 
    console.log('Applying for the offer');
  };

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

        <div className="flex">
          <button
            type="button"
            className="items-center text-blue-600 text-sm bg-blue-50 py-1.5 rounded-full mb-4"
          >
            Expérience: {experience}
          </button>
        </div>

        <div className="font-[sans-serif] flex flex-wrap gap-4 items-center mx-auto">
          <div className="flex flex-wrap gap-4">
            {skillsRequired.map((skill, index) => (
              <button
                key={index}
                type="button"
                className="flex items-center text-buttonColor1 text-sm bg-backgroundColor2 px-3 py-1.5 tracking-wide rounded-full"
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

       
        {userRole === 'Candidate' && applied ? (
          <div className="flex justify-center mt-2">
            <div className="flex items-center">
              <SquareCheck size={18} className="text-green-500 mr-2" />
              <span className="text-green-500">Déjà postulé</span>
            </div>
            <button className="bg-buttonColor1 text-white px-4 py-2 rounded-full hover:bg-buttonColor2 ml-4" onClick={handleCheckApplication}>
              Voir votre candidature
            </button>
          </div>
        ) : (
          userRole === 'Candidate' && (
            <div className="flex justify-center mt-2">
              <button className="bg-buttonColor1 text-white px-4 py-2 rounded-full hover:bg-buttonColor2" onClick={handleApply}>
                Postuler
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default OfferDetails;
