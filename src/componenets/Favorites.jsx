import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, Briefcase, MapPin, FileText, Calendar, Clock9 } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const [userId, setUserId] = useState(null);
  const [favorites, setFavorites] = useState([]); 
  const [offers, setOffers] = useState([]); // State to hold detailed offers
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchUserData = async () => {
      const userEmail = localStorage.getItem('userEmail');
      try {
        const response = await axios.post('http://localhost:3000/users/findByEmail', { email: userEmail });
        if (response.data && response.data._id) {
          setUserId(response.data._id);
        } else {
          console.error('User not found or missing _id in response');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:3000/favorites/user/${userId}`);
          setFavorites(response.data);
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      }
    };

    fetchFavorites();
  }, [userId]);

  useEffect(() => {
    const fetchOffers = async () => {
      const offerDetails = await Promise.all(
        favorites.map(async (fav) => {
          try {
            const response = await axios.get(`http://localhost:3000/offers/${fav.offerId}`);
            return response.data;
          } catch (error) {
            console.error(`Error fetching offer with ID ${fav.offerId}:`, error);
            return null;
          }
        })
      );
      setOffers(offerDetails.filter(offer => offer !== null));
    };

    if (favorites.length > 0) {
      fetchOffers();
    }
  }, [favorites]);

  const handleOfferClick = (offerId) => {
    navigate(`/offer/${offerId}`);
  };

  return (
    <div className="favorites-container">
      <h1 className="text-2xl font-bold mb-4">Favorite Offers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((offer) => (
          <div key={offer._id} className="bg-white shadow-md rounded-lg p-4">
            <div className="relative">
              <Heart size={24} className="text-red-500 absolute top-2 right-2" />
              <h2 className="text-xl font-bold mb-2 flex items-center">
                <Briefcase size={18} className="mr-1" />
                {offer.title}
              </h2>
              <p className="text-gray-700 mb-2 flex items-center">
                <MapPin size={18} className="mr-2" />
                <strong>Location:</strong> {offer.location}
              </p>
              <p className="text-gray-700 mb-2 flex items-center">
                <FileText size={18} className="mr-2" />
                <strong>Contract Type:</strong> {offer.contractType}
              </p>
              <p className="text-gray-700 mb-2 flex items-center">
                <Calendar size={18} className="mr-2" />
                <strong>Deadline:</strong> {offer.maxDate}
              </p>
              <p className="text-gray-700 mb-2">
                {offer.description}
              </p>
              <div className="flex items-center text-gray-700 mb-2">
                <Clock9 size={13} className="mr-1" />
                <p className="text-sm">Posted {Math.ceil((new Date() - new Date(offer.createdAt)) / (1000 * 60 * 60 * 24))} days ago</p>
              </div>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-700"
                onClick={() => handleOfferClick(offer._id)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;


