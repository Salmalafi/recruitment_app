import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddHrAgent from './AddHR';
import UpdateHrAgent from './UpdateHR';
import ConfirmModal from './ConfirmModal'; // Import ConfirmModal
import { ToastContainer, toast } from 'react-toastify';

const HrAgentTable = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // New state for confirmation modal
  const [agentToDelete, setAgentToDelete] = useState(null); // Store the agent to be deleted

  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const hrAgents = response.data.filter(user => user.role === 'HrAgent');
      setAgents(hrAgents);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleDelete = async (agentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/users/${agentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Agent deleted successfully'); // Notify success
      fetchAgents(); // Refresh the list of agents
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast.error('Error deleting agent'); // Notify error
    }
  };

  const handleConfirmDelete = () => {
    if (agentToDelete) {
      handleDelete(agentToDelete);
      setAgentToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  const handleAddAgent = () => {
    setIsAddModalOpen(true);
  };

  const handleEditAgent = (agent) => {
    setSelectedAgent(agent);
    setIsEditModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedAgent(null);
  };

  const handleAgentAdded = () => {
    setLoading(true);
    setIsAddModalOpen(false);
    fetchAgents(); // Refresh the list of agents
  };

  const handleAgentUpdated = () => {
    setLoading(true);
    setIsEditModalOpen(false);
    fetchAgents(); // Refresh the list of agents
  };

  const showConfirmModal = (agentId) => {
    setAgentToDelete(agentId);
    setIsConfirmModalOpen(true);
  };

  return (
    <div className="font-[sans-serif] overflow-x-auto">
      <ToastContainer />
      <button
        onClick={handleAddAgent}
        className="mb-4 px-6 py-3 bg-buttonColor5 text-gray-700 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105"
      >
        Add an Agent
      </button>

      <table className="min-w-full bg-white">
        <thead className="whitespace-nowrap">
          <tr>
            <th className="pl-4 w-8">
              {/* Checkbox for selection */}
            </th>
            <th className="p-4 text-left text-sm font-semibold text-black">Name</th>
            <th className="p-4 text-left text-sm font-semibold text-black">Role</th>
            <th className="p-4 text-left text-sm font-semibold text-black">Active</th>
            <th className="p-4 text-left text-sm font-semibold text-black">Action</th>
          </tr>
        </thead>
        <tbody className="whitespace-nowrap">
          {loading ? (
            <tr>
              <td colSpan="5" className="text-center py-4">Loading...</td>
            </tr>
          ) : (
            agents.map(agent => (
              <tr key={agent._id} className="odd:bg-blue-50">
                <td className="pl-4 w-8">
                  {/* Checkbox for selection */}
                </td>
                <td className="p-4 text-sm">
                  <div className="flex items-center cursor-pointer w-max">
                    <img src='https://readymadeui.com/profile_6.webp' className="w-9 h-9 rounded-full shrink-0" />
                    <div className="ml-4">
                      <p className="text-sm text-black">{agent.firstName} {agent.lastName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{agent.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-black">{agent.role}</td>
                <td className="p-4">
                  <label className="relative cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={agent.active} readOnly />
                    <div className="w-11 h-6 flex items-center bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:absolute after:left-[2px] peer-checked:after:border-white after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007bff]" />
                  </label>
                </td>
                <td className="p-4">
                  <button
                    className="mr-4"
                    title="Edit"
                    onClick={() => handleEditAgent(agent)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 fill-blue-500 hover:fill-blue-700" viewBox="0 0 348.882 348.882">
                      <path
                        d="m333.988 11.758-.42-.383A43.363 43.363 0 0 0 304.258 0a43.579 43.579 0 0 0-32.104 14.153L116.803 184.231a14.993 14.993 0 0 0-3.154 5.37l-18.267 54.762c-2.112 6.331-1.052 13.333 2.835 18.729 3.918 5.438 10.23 8.685 16.886 8.685h.001c2.879 0 5.693-.592 8.362-1.76l52.89-23.138a14.985 14.985 0 0 0 5.063-3.626L336.771 73.176c16.166-17.697 14.919-45.247-2.783-61.418zM130.381 234.247l10.719-32.134.904-.99 20.316 18.556-.904.99-31.035 13.578zm184.24-181.304L182.553 197.53l-20.316-18.556L294.305 34.386a13.594 13.594 0 0 1 9.997-4.402c3.331 0 6.463 1.226 8.922 3.457l.42.384c5.426 4.936 5.838 13.28.916 18.723zm-7.376 285.939H41.308c-10.784 0-19.541-8.756-19.541-19.541V65.541c0-10.784 8.756-19.541 19.541-19.541h196.99c6.59 0 11.933-5.343 11.933-11.933s-5.343-11.933-11.933-11.933H41.308C18.523 22.133 0 40.656 0 63.441v255.801c0 22.785 18.523 41.308 41.308 41.308h265.937c6.59 0 11.933-5.343 11.933-11.933s-5.343-11.933-11.933-11.933z"
                        data-original="#000000"
                        xmlns="http://www.w3.org/2000/svg"
                      />
                    </svg>
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                    onClick={() => showConfirmModal(agent._id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 fill-red-500 hover:fill-red-700" viewBox="0 0 482.344 482.344">
                      <path
                        d="M104.095 35.552c0-14.698 11.902-26.542 26.542-26.542h220.57c14.697 0 26.542 11.846 26.542 26.542v24.023h57.785c10.962 0 19.893 8.932 19.893 19.892v13.992c0 10.961-8.932 19.893-19.893 19.893h-6.177L398.878 448.16c-7.198 12.37-21.61 19.647-35.58 19.647H119.046c-13.967 0-28.405-7.287-35.596-19.647L37.795 89.453h-6.144c-10.961 0-19.892-8.932-19.892-19.893v-13.992c0-10.96 8.931-19.892 19.892-19.892h57.785v-24.023zM309.098 71.533H173.28v-2.171c0-10.895-8.855-19.892-19.892-19.892s-19.892 8.855-19.892 19.892v2.171H55.108v-4.043c0-10.961 8.932-19.892 19.892-19.892h352.256c10.961 0 19.892 8.932 19.892 19.892v4.043h-54.946v-2.171c0-10.895-8.855-19.892-19.892-19.892s-19.892 8.855-19.892 19.892v2.171z"
                        data-original="#000000"
                        xmlns="http://www.w3.org/2000/svg"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {isAddModalOpen && (
        <AddHrAgent
          onClose={handleCloseAddModal}
          onAgentAdded={handleAgentAdded}
        />
      )}

      {isEditModalOpen && selectedAgent && (
        <UpdateHrAgent
        hrAgentId={selectedAgent._id}
          onClose={handleCloseEditModal}
          onAgentUpdated={handleAgentUpdated}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </div>
  );
};

export default HrAgentTable;
