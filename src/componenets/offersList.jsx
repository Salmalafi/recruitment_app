import React, { useState } from 'react';
import Offer from './offer';


const OffersList = ({ offers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contractFilter, setContractFilter] = useState('all');
  const [typeContrat, setTypeContrat] = useState('all');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleContractFilterChange = (event) => {
    setContractFilter(event.target.value);
  };

  const handletypecontrat = (event) => {
    setTypeContrat(event.target.value);
  };

  // Filter logic for offers based on search term and filter selection
  const filteredOffers = offers.filter((offer) => {
    const titleMatches = offer.title.toLowerCase().includes(searchTerm.toLowerCase());
    const contractFilterMatches = contractFilter === 'all' || offer.contractType === contractFilter;
    const typeContratMatches = typeContrat === 'all' || offer.typeContrat === typeContrat;
    return titleMatches && contractFilterMatches && typeContratMatches;
  });

  return (
    <div className="container mx-auto">
      {/* Center-aligned search box and filter */}
      <div className="my-4 flex justify-center items-center mt-6 ">
        <input
          type="text"
          placeholder="Rechercher par titre de poste..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border border-buttonColor2 p-2 rounded-full mr-2 " style={{ width: '350px' }}
        />
        {/* Contract Type Filter */}
        <select
          value={contractFilter}
          onChange={handleContractFilterChange}
          className="border border-buttonColor2 p-2 rounded-full mr-2"
        >
          <option value="Tous">Tous Types</option>
          <option value="CDI">CDI</option>
          <option value="CDD">CDD</option>
          <option value="stage">Stage</option>
          <option value="Alternance">Alternance</option>
        </select>
         {/* Type Contrat Filter */}
        <select
          value={typeContrat}
          onChange={handletypecontrat}
          className="border border-buttonColor2 p-2 rounded-full"
        >
          <option value="Tous">Touts Rythmes </option>
          <option value="Temps plein">Temps plein</option>
          <option value="Temps partiel">Temps partiel</option>
          <option value="Stage">Stage</option>
          {/* Add more options for other filter criteria */}
        </select>
      </div>
      
      {/* List of filtered offers */}
      <div className="grid grid-cols-1 p-8 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOffers.map((offer) => (
          <Offer
            key={offer.reference}
            reference={offer.reference}
            title={offer.title}
            contractType={offer.contractType}
            location={offer.location}
            description={offer.description}
            MaxDate={offer.MaxDate}
            expired={offer.expired}
          />
        ))}
      </div>
    </div>
  );
};

export default OffersList;


