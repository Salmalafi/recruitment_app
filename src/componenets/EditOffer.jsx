import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
const EditOfferForm = ({ offerData }) => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
      reference: '',
      title: '',
      contractType: '',
      location: '',
      maxDate: '',
      jobDescription: '',
      profilCherche: '',
      whatWeOffer: '',
      experience: '',
      skillsRequired: [],
    });
  
    const [skill, setSkill] = useState('');

  
    useEffect(() => {
      const fetchOffer = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/offers/${id}`);
          const { data } = response;
          setFormData({
            reference: data.reference,
            title: data.title,
            contractType: data.contractType,
            location: data.location,
            maxDate: data.maxDate,
            jobDescription: data.jobDescription,
            profilCherche: data.profilCherche,
            whatWeOffer: data.whatWeOffer,
            experience: data.experience,
            skillsRequired: data.skillsRequired,
          });
        } catch (error) {
          console.error('Error fetching offer:', error);
          // Handle error (e.g., show error message)
        }
      };
  
      fetchOffer();
    }, [id]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSkillChange = (e) => {
      setSkill(e.target.value);
    };
  
    const addSkill = () => {
      if (skill) {
        setFormData({ ...formData, skillsRequired: [...formData.skillsRequired, skill] });
        setSkill('');
      }
    };
  
    const deleteSkill = (index) => {
      const updatedSkills = formData.skillsRequired.filter((_, i) => i !== index);
      setFormData({ ...formData, skillsRequired: updatedSkills });
    };
 
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const token= localStorage.getItem('token');
        const response = await axios.patch(
          `http://localhost:3000/offers/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        console.log('Offer updated:', response.data);
        alert('Offer updated successfully!');
  
        // Optionally reset form fields after successful submission
        // setFormData({
        //   reference: '',
        //   title: '',
        //   contractType: '',
        //   location: '',
        //   maxDate: '',
        //   jobDescription: '',
        //   profilCherche: '',
        //   whatWeOffer: '',
        //   experience: '',
        //   skillsRequired: [],
        // });
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to save offer. Please try again.');
      }
    };
  
    const contractTypes = ['CDD', 'CDI', 'stage', 'apprentissage'];
    const locations = [
      'Paris, France',
      'Grenoble, France',
      'Lille, France',
      'Nantes, France',
      'Lyon, France',
      'Rennes, France',
      'Aix en provence, France',
      'Toulouse, France',
    ];
  return (
    <div className="mt-6 max-w-6xl max-lg:max-w-3xl mx-auto bg-customBlue rounded-lg shadow-lg p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{offerData ? 'Edit Offer' : 'Add New Offer'}</h1>
      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        Fill in the details below to {offerData ? 'edit' : 'add'} a job offer.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-600">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Reference */}
            <div>
              <label htmlFor="reference" className="block text-sm font-medium text-gray-600">
                Reference
              </label>
              <input
                type="text"
                name="reference"
                id="reference"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100"
                value={formData.reference}
                onChange={handleChange}
                required
              />
            </div>

            {/* Contract Type */}
            <div>
              <label htmlFor="contractType" className="block text-sm font-medium text-gray-600">
                Contract Type
              </label>
              <select
                name="contractType"
                id="contractType"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100"
                value={formData.contractType}
                onChange={handleChange}
                required
              >
                <option value="">Select contract type</option>
                {contractTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-600">
                Location
              </label>
              <select
                name="location"
                id="location"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100"
                value={formData.location}
                onChange={handleChange}
                required
              >
                <option value="">Select location</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Date */}
            <div>
              <label htmlFor="maxDate" className="block text-sm font-medium text-gray-600">
                Max Date
              </label>
              <input
                type="date"
                name="maxDate"
                id="maxDate"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100"
                value={formData.maxDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Job Description */}
            <div>
              <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-600">
                Job Description
              </label>
              <textarea
                name="jobDescription"
                id="jobDescription"
                rows="4"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100"
                value={formData.jobDescription}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {/* Profile Sought */}
            <div>
              <label htmlFor="profilCherche" className="block text-sm font-medium text-gray-600">
                Profile Sought
              </label>
              <textarea
                name="profilCherche"
                id="profilCherche"
                rows="4"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100"
                value={formData.profilCherche}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {/* What We Offer */}
            <div>
              <label htmlFor="whatWeOffer" className="block text-sm font-medium text-gray-600">
                What We Offer
              </label>
              <textarea
                name="whatWeOffer"
                id="whatWeOffer"
                rows="4"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100"
                value={formData.whatWeOffer}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {/* Experience */}
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-600">
                Experience
              </label>
              <select
                name="experience"
                id="experience"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100"
                value={formData.experience}
                onChange={handleChange}
                required
              >
                <option value="">Select experience level</option>
                <option value="debutant">Débutant</option>
                <option value="junior">Junior</option>
                <option value="confirme">Confirmé</option>
                <option value="expert">Expert</option>
                <option value="senior">Senior</option>
              </select>
            </div>

            {/* Skills Required */}
            <div>
              <label htmlFor="skillsRequired" className="block text-sm font-medium text-gray-600">
                Skills Required
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  name="skillsRequired"
                  id="skillsRequired"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100"
                  value={skill}
                  onChange={handleSkillChange}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="ml-2 bg-customPurple hover:bg-purple-700 text-white rounded-full font-medium py-2 px-4"
                >
                  Add
                </button>
              </div>
              <ul className="mt-1">
                {formData.skillsRequired.map((skill, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600 mt-2">
                    <span className="text-white bg-buttonColor5 px-3 py-1.5 rounded-full text-sm tracking-wide">
                      {skill}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteSkill(index)}
                      className="ml-2 font-medium py-2 px-3 text-customPurple hover:text-red-700"
                    >
                      <Trash2 />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-customPurple hover:bg-purple-700 text-white rounded-full font-medium py-2 px-10"
          >
            {offerData ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditOfferForm;
