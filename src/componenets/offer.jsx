import React, { useState, useEffect } from 'react';
import { MapPin, Briefcase, FileText, Calendar } from 'lucide-react';
import axios from 'axios';
import Apply from './Apply';
import OfferDetails from './OfferDetails';

const Offer = ({ _id, reference, title, contractType, location, description, maxDate, expired, jobDescription, profilCherche, skillsRequired, experience, whatWeOffer }) => {
  const [showApply, setShowApply] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const userEmail = localStorage.getItem('userEmail');
      try {
        const response = await axios.post('http://localhost:3000/users/findByEmail', { email: userEmail });
        if (response.data && response.data._id) {
          setUserId(response.data._id);
          console.log('UserId:', response.data._id);
        } else {
          console.error('User not found or missing _id in response');
        }
      } catch (error) {
        console.error('Error fetching userId:', error);
      }
    };

    fetchUserId();
  }, []);

  const handleApplyClick = () => {
    setShowApply(true);
  };

  const handleCloseApply = () => {
    setShowApply(false);
  };

  const handleDetailsClick = () => {
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const offerDetails = { _id, reference, title, contractType, location, maxDate, jobDescription, profilCherche, skillsRequired, experience, whatWeOffer };

  return (
    <div className={`bg-customBlue rounded-xl shadow-xl p-6 mb-4 ${expired ? 'opacity-50 animate-flyin ' : 'hover:bg-hoverColor hover:animate-dropin'}`}>
      <div className=" relative w-full">
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
        <div className="flex justify-center gap-3 mb-4">
          {!expired ? (
            <>
              <button className="bg-buttonColor1 text-white px-4 py-2 rounded-full hover:bg-buttonColor2" onClick={handleApplyClick}>Postuler</button>
              <button className="bg-buttonColor2 text-white px-4 py-2 rounded-full hover:bg-buttonColor1" onClick={handleDetailsClick}>Voir détails</button>
            </>
          ) : (
            <p className="text-red-500">Expiré</p>
          )}
        </div>
        <span className="bg-green-500 px-5 py-1 text-[10px] text-white rounded absolute -top-7">New</span>
      </div>
      {showApply && <Apply show={showApply} onClose={handleCloseApply} userId={userId} offerId={_id} />}
      {showDetails && <OfferDetails offer={offerDetails} onClose={handleCloseDetails} />}
    </div>
  );
};

export default Offer;










