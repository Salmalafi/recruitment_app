import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Offer from './offer';
import FilterButton from '../componenets/DropdownFilter';

const OffersList = ({ showOnlyFavorites }) => {
  const [offers, setOffers] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [contractFilter, setContractFilter] = useState('all');
  const [typeContrat, setTypeContrat] = useState('all');

  const fetchOffers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/offers');
      setOffers(response.data);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const fetchFavorites = async () => {
    const userEmail = localStorage.getItem('userEmail');
    try {
      const userResponse = await axios.post('http://localhost:3000/users/findByEmail', { email: userEmail });
      const userId = userResponse.data._id;

      const favoritesResponse = await axios.get(`http://localhost:3000/favorites/user/${userId}`);
      setFavorites(favoritesResponse.data.map(fav => fav.offerId));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  useEffect(() => {
    fetchOffers();
    if (showOnlyFavorites) {
      fetchFavorites();
    }
  }, [showOnlyFavorites]);

  const handleSearchChange = (event) => {
    const normalizedSearchTerm = event.target.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    setSearchTerm(normalizedSearchTerm.toLowerCase());
  };

  const handleContractFilterChange = (event) => {
    setContractFilter(event.target.value);
  };

  const handleTypeContratChange = (event) => {
    setTypeContrat(event.target.value);
  };

  const filteredOffers = offers.filter((offer) => {
    const titleMatches = offer.title.toLowerCase().includes(searchTerm.toLowerCase());
    const contractFilterMatches = contractFilter === 'all' || offer.contractType === contractFilter;
    const typeContratMatches = typeContrat === 'all' || offer.typeContrat === typeContrat;
    const favoriteFilterMatches = !showOnlyFavorites || favorites.includes(offer._id);
    return titleMatches && contractFilterMatches && typeContratMatches && favoriteFilterMatches;
  });

  return (
    <div className="container mx-auto">
      <div className="my-4 flex justify-center items-center mt-6">
        <input
          type="text"
          placeholder="Search by job title or reference..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border dark:text-black border-buttonColor2 p-2 rounded-full mr-2"
          style={{ width: '500px' }}
        />
        <FilterButton />
      </div>

      <div className="grid grid-cols-1 p-8 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOffers.map((offer) => (
          <Offer
            key={offer._id}
            reference={offer.reference}
            title={offer.title}
            fetchOffers={fetchOffers}
            contractType={offer.contractType}
            location={offer.location}
            description={offer.jobDescription}
            maxDate={offer.maxDate}
            expired={new Date(offer.maxDate) < new Date()}
            jobDescription={offer.jobDescription}
            profilCherche={offer.profilCherche}
            whatWeOffer={offer.whatWeOffer}
            skillsRequired={offer.skillsRequired}
            experience={offer.experience}
            createdAt={offer.createdAt}
            _id={offer._id}
            onApplicationSubmit={fetchOffers}
          />
        ))}
      </div>
    </div>
  );
};

export default OffersList;







