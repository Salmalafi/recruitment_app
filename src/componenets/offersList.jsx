import React, { useState, useEffect } from 'react';
import Offer from './offer';
import FilterButton from '../componenets/DropdownFilter';
import axios from 'axios';

const OffersList = () => {
  const [offers, setOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [contractFilter, setContractFilter] = useState('all');
  const [typeContrat, setTypeContrat] = useState('all');

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/offers');
        setOffers(response.data);
      } catch (error) {
        console.error('Error fetching offers:', error);
      }
    };
    fetchOffers();
  }, []);

  const handleSearchChange = (event) => {
    // Normalize the search term by removing accents
    const normalizedSearchTerm = event.target.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    // Update the state with the normalized search term
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
    return titleMatches && contractFilterMatches && typeContratMatches;
  });

  return (
    <div className="container mx-auto">
      <div className="my-4 flex justify-center items-center mt-6">
        <input
          type="text"
          placeholder="Rechercher par titre de poste ou référence..."
          value={searchTerm}
          onChange={handleSearchChange} // Bind handleSearchChange to onChange event
          className="border border-buttonColor2 p-2 rounded-full mr-2"
          style={{ width: '500px' }}
        />
        <FilterButton />
      </div>

      <div className="grid grid-cols-1 p-8 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOffers.map((offer) => (
          <Offer
            key={offer._id} // Ensure each Offer component has a unique key
            reference={offer.reference}
            title={offer.title}
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
            _id={offer._id} // Pass _id as a prop to Offer component
          />
        ))}
      </div>
    </div>
  );
};

export default OffersList;




