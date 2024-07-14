import React, { useState, useEffect } from 'react';
import { Pencil, MapPin, Briefcase, FileText, Calendar, Clock9, Trash2, SquareCheck } from 'lucide-react'; // Import Lucide icons
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Apply from './Apply';
import OfferDetails from './OfferDetails';

const Offer = ({ _id, reference, title, fetchOffers, contractType, location, description, maxDate, expired, jobDescription, profilCherche, skillsRequired, experience, whatWeOffer, createdAt }) => {
  const [showApply, setShowApply] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [daysAgo, setDaysAgo] = useState(0);
  const navigate = useNavigate(); 
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [alreadyApplied, setAlreadyApplied] = useState(false); 

  useEffect(() => {
    const fetchUserData = async () => {
      const userEmail = localStorage.getItem('userEmail');
      try {
        const response = await axios.post('http://localhost:3000/users/findByEmail', { email: userEmail });
        if (response.data && response.data._id && response.data.role) {
          setUserId(response.data._id);
          setUserRole(response.data.role);
        } else {
          console.error('User not found or missing _id or role in response');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const calculateDaysAgo = () => {
      const currentDate = new Date();
      const createdDate = new Date(createdAt);
      const diffTime = Math.abs(currentDate - createdDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysAgo(diffDays);
    };

    calculateDaysAgo();
  }, [createdAt]);

  useEffect(() => {
    const fetchApplicationsCount = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/applications/offer/${_id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setApplicationsCount(response.data.length);
      } catch (error) {
        console.error('Error fetching applications count:', error);
      }
    };

    fetchApplicationsCount();
  }, [_id]);

  useEffect(() => {
    const checkAlreadyApplied = async () => {
      if (userRole === 'Candidate') {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:3000/applications/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const found = response.data.some(application => application.offerId === _id);
          setAlreadyApplied(found);
        } catch (error) {
          console.error('Error checking if already applied:', error);
        }
      }
    };

    if (userId && userRole === 'Candidate') {
      checkAlreadyApplied();
    }
  }, [userId, userRole, _id]);

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

  const handleDeleteClick = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:3000/offers/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Delete offer response:', response.data);
      fetchOffers();
    } catch (error) {
      console.error('Error deleting offer:', error);
    }
  };

  const handleViewApplicationsClick = () => {
    navigate(`/dashboardHR/applications/${_id}`);
  };

  const handleEditClick = () => {
    navigate(`/dashboardHR/edit/${_id}`);
  };

  const handleCheckApplication = () => {
    navigate(`/dashboardHR/applications/${_id}`);
  };

  const offerDetails = { _id, reference, title, contractType, location, maxDate, jobDescription, profilCherche, skillsRequired, experience, whatWeOffer };

  return (
    <div className={`bg-customBlue rounded-xl shadow-xl p-6 mb-4 ${expired ? 'opacity-50 animate-flyin' : 'hover:bg-hoverColor hover:animate-dropin'}`}>
      <div className="relative w-full">
        <div className="absolute ml-0 top-1 gap-1 right-1 flex items-center">
          {(userRole === 'admin' || userRole === 'HrAgent') && (
            <>
              <Pencil size={20} className="mr-1 cursor-pointer" onClick={handleEditClick} />
              <Trash2 size={20} className="mr-1 cursor-pointer" onClick={handleDeleteClick} />
            </>
          )}
        </div>
        <h2 className="text-xl font-bold mb-2 flex items-center flex-wrap">
          <Briefcase size={18} className="mr-1" />
          <span className="flex-1">{title}</span>
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
        <p className="text-gray-700 mb-2">
          {description}
        </p>
        <div className="flex items-center text-gray-700 mb-2">
          <Clock9 size={13} className="mr-1" />
          <p className="text-sm">Il y a {daysAgo} jours</p>
        </div>
        <div className="flex justify-center gap-3 mb-4">
          {!expired ? (
            userRole === 'admin' || userRole === 'HrAgent' ? (
              <div className="relative">
                <button
                  className="bg-buttonColor1 text-white px-4 py-2 rounded-full hover:bg-buttonColor2 relative"
                  onClick={handleViewApplicationsClick}
                >
                  Voir candidatures
                </button>
                {applicationsCount > 0 && ( 
                  <span className="bg-red-500 text-[10px] px-1.5 font-semibold min-w-[16px] h-4 flex items-center justify-center text-white rounded-full absolute -top-2 -right-2">
                    {applicationsCount > 99 ? '99+' : applicationsCount}
                  </span>
                )}
              </div>
            ) : alreadyApplied ? (
              <div className="flex flex-col items-center mt-2">
  <div className="flex items-center">
      <SquareCheck size={18} className="text-green-500 mr-2" />
      <span className="text-green-500">Déjà postulé</span>
    </div>
  <button
    className="bg-buttonColor1 text-white px-4 py-2 rounded-full hover:bg-buttonColor2 mt-2"
    onClick={handleCheckApplication}
  >
    Voir candidature
  </button>
</div>

            ) : (
              <button className="bg-buttonColor1 text-white px-4 py-2 rounded-full hover:bg-buttonColor2" onClick={handleApplyClick}>
                Postuler
              </button>
            )
          ) : (
            <p className="text-red-500">Expiré</p>
          )}
          <button className="bg-buttonColor2 text-white px-4 py-2 rounded-full hover:bg-buttonColor2 relative" onClick={handleDetailsClick}>
            Voir détails
          </button>
        </div>
        <span className="bg-green-500 px-5 py-1 text-[10px] text-white rounded absolute -top-7">New</span>
      </div>
      {showApply && <Apply show={showApply} onClose={handleCloseApply} userId={userId} offerId={_id} />}
      {showDetails && <OfferDetails offer={offerDetails} onClose={handleCloseDetails} />}
    </div>
  );
};

export default Offer;







