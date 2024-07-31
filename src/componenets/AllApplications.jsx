import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircleCheck, CircleX } from 'lucide-react';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const AllApplications = () => {
    const [applications, setApplications] = useState([]);
    const [users, setUsers] = useState({});
    const [offers, setOffers] = useState([]);
    const [selectedOffer, setSelectedOffer] = useState('');
    const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'
    const [priorityOrder, setPriorityOrder] = useState('none'); // 'none', 'highest', or 'lowest'
    const [searchTerm, setSearchTerm] = useState('');
    const token = localStorage.getItem('token');
 const isDeclined="False";
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3000/applications',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setApplications(response.data);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };

        const fetchOffers = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3000/offers',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setOffers(response.data);
            } catch (error) {
                console.error('Error fetching offers:', error);
            }
        };

        fetchApplications();
        fetchOffers();
    }, [token]);

    useEffect(() => {
        const fetchUserDetails = async (userId) => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/users/${userId}`
                );
                setUsers((prevUsers) => ({
                    ...prevUsers,
                    [userId]: response.data,
                }));
            } catch (error) {
                console.error('Error fetching user details:', error);
                if (error.response) {
                    console.error('Server responded with:', error.response.data);
                }
            }
        };
        applications.forEach((application) => {
            if (application.userId && !users[application.userId]) {
                fetchUserDetails(application.userId);
            }
        });
    }, [applications, users]);

    const downloadFile = async (resumeUrl) => {
        try {
          const response = await axios.get(resumeUrl, {
            responseType: 'blob', 
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
    
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'resume.pdf');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          console.error('Error downloading file:', error);
        }
      };
    useEffect(() => {
        if (selectedOffer && priorityOrder !== 'none') {
            const fetchSortedByPriority = async () => {
                try {
                    const offer = offers.find((offer) => offer._id === selectedOffer);
                    if (!offer) return;

                    const response = await axios.post(
                        `http://localhost:3000/applications/process_cvs?offerId=${selectedOffer}`,
                        { skills: offer.skillsRequired },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    setApplications(response.data);
                } catch (error) {
                    console.error('Error fetching sorted applications by priority:', error);
                }
            };

            fetchSortedByPriority();
        }
    }, [selectedOffer, priorityOrder, offers, token]);

    const updateApplicationStatus = async (applicationId, newStatus) => {
        try {
            await axios.patch(
                `http://localhost:3000/applications/${applicationId}`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setApplications((prevApplications) =>
                prevApplications.map((application) =>
                    application._id === applicationId
                        ? { ...application, status: newStatus }
                        : application
                )
            );
        } catch (error) {
            console.error('Error updating application status:', error);
        }
    };

    const handleStatusUpdate = (applicationId, currentStatus, action) => {
        switch (action) {
            case 'accept':
                switch (currentStatus) {
                    case 'PENDING':
                        updateApplicationStatus(applicationId, 'Accepted for 1st Interview');
                        break;
                    case 'Accepted for 1st Interview':
                        updateApplicationStatus(applicationId, 'Accepted for In-Depth Interview');
                        break;
                    case 'Accepted for In-Depth Interview':
                        updateApplicationStatus(applicationId, 'Hired');
                        break;
                    default:
                        break;
                }
                break;
            case 'decline':
                updateApplicationStatus(applicationId, 'Declined for Next Step');
                
                break;
            default:
                break;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING':
                return '1st Interview';
            case 'Accepted for 1st Interview':
                return 'In-Depth Interview';
            case 'Accepted for In-Depth Interview':
                return 'Hired';
            default:
                return '';
        }
    };

    const renderActions = (status, applicationId) => {
        switch (status) {
            case 'PENDING':
                return (
                    <div>
                        <div className="text-sm text-gray-700">1st Interview:</div>
                        <div className="flex space-x-2 items-center mt-2">
                            <button
                                className="text-green-500 focus:outline-none"
                                onClick={() => handleStatusUpdate(applicationId, status, 'accept')}
                            >
                                <CircleCheck size={24} />
                            </button>
                            <button
                                className="text-red-500 focus:outline-none"
                                onClick={() => handleStatusUpdate(applicationId, status, 'decline')}
                            >
                                <CircleX size={24} />
                            </button>
                        </div>
                    </div>
                );
            case 'Accepted for 1st Interview':
                return (
                    <div>
                        <div className="text-sm text-gray-700">In-Depth Interview:</div>
                        <div className="flex space-x-2 items-center mt-2">
                            <button
                                className="text-green-500 focus:outline-none"
                                onClick={() => handleStatusUpdate(applicationId, status, 'accept')}
                            >
                                <CircleCheck size={24} />
                            </button>
                            <button
                                className="text-red-500 focus:outline-none"
                                onClick={() => handleStatusUpdate(applicationId, status, 'decline')}
                            >
                                <CircleX size={24} />
                            </button>
                        </div>
                    </div>
                );
            case 'Accepted for In-Depth Interview':
                return (
                    <div>
                        <div className="text-sm justify-center text-gray-700">Hire</div>
                        <div className="flex space-x-2 items-center mt-2">
                            <button
                                className="text-green-500 focus:outline-none"
                                onClick={() => handleStatusUpdate(applicationId, status, 'accept')}
                            >
                                <CircleCheck size={24} />
                            </button>
                            <button
                                className="text-red-500 focus:outline-none"
                                onClick={() => handleStatusUpdate(applicationId, status, 'decline')}
                            >
                                <CircleX size={24} />
                            </button>
                        </div>
                    </div>
                );
            case 'Hired':
                return null;
            case 'Declined':
            case 'Declined for Next Step':
                return null;
            default:
                return null;
        }
    };

    const filteredApplications = selectedOffer
        ? applications.filter(app => app.offerId === selectedOffer)
        : applications;

    const searchFilteredApplications = filteredApplications.filter((application) => {
        const user = users[application.userId];
        const fullName = user ? `${user.firstName} ${user.lastName}`.toLowerCase() : '';
        return (
            fullName.includes(searchTerm.toLowerCase()) ||
            application.date.includes(searchTerm.toLowerCase()) ||
            application.status.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const sortedApplications = [...searchFilteredApplications].sort((a, b) => {
        if (priorityOrder !== 'none') {
            // Assuming priority is a numerical value
            return priorityOrder === 'highest' ? b.priority - a.priority : a.priority - b.priority;
        }
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return (
        <div className="font-sans overflow-x-auto">
            <div className="p-4">
                <label htmlFor="offerFilter" className="block text-sm font-medium text-gray-700">
                    Filter by Offer
                </label>
                <select
                    id="offerFilter"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={selectedOffer}
                    onChange={(e) => setSelectedOffer(e.target.value)}
                >
                    <option value="">All Offers</option>
                    {offers.map((offer) => (
                        <option key={offer._id} value={offer._id}>
                            {offer.reference} - {offer.title}
                        </option>
                    ))}
                </select>
            </div>
            <div className="p-4 flex ">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="py-2 px-10 mr-20 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
               <div className="flex justify-end mr-1">
    <button
        onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
        className="py-2 px-4 bg-buttonColor5 mr-20 rounded-full text-black  shadow-sm mr-2"
    >
        Sort by {sortOrder === 'newest' ? 'Oldest' : 'Newest'}
    </button>
    <button
        onClick={() => setPriorityOrder(priorityOrder === 'highest' ? 'lowest' : 'highest')}
        className="py-2 px-4 bg-buttonColor2 text-black rounded-full  shadow-sm"
    >
        Sort by Priority {priorityOrder === 'highest' ? 'Lowest' : 'Highest'}
    </button>
</div>

            </div>
            <table className="min-w-full bg-white">
                <thead className="whitespace-nowrap">
                    <tr>
                        <th className="p-4 text-left text-sm font-semibold text-gray-800">Date</th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-800">Status</th>
                     
                        <th className="p-4 text-left text-sm font-semibold text-gray-800">Resume</th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-800">Candidate Name</th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-800">Email</th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-800">Phone</th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-800">Actions</th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-800">Score</th> {/* New column */}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {sortedApplications.map((application) => (
                        <tr key={application._id} className="text-gray-700">
                            <td className="p-4 max-w-[100px] break-words">
                                {new Date(application.date).toLocaleDateString()}
                            </td>
                            <td className="p-4 text-sm text-gray-800">
                                <span className="w-[68px] block text-center py-1 border border-green-500 text-green-600 rounded text-xs">
                                    {application.status}
                                </span>
                            </td>
                         
                            <td className="p-4 text-sm font-semibold text-gray-800">
  <div className="flex flex-col items-center">
    <Viewer
      fileUrl={`http://localhost:3000/applications/resume/${application.resume}`}
      httpHeaders={{ Authorization: `Bearer ${token}` }}
      renderError={() => <div>Error loading PDF</div>}
      renderLoading={() => <div>Loading PDF...</div>}
      defaultScale={0.15}
    
    />
    <button
      className="bg-buttonColor2 hover:bg-blue-700 text-gray-900 h-8 w-20 font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mt-2"
   onClick={() => downloadFile(`http://localhost:3000/applications/resume/${application.resume}`)}
    >
      Download
    </button>
  </div>
</td>

                            <td className="p-4 max-w-[100px] break-words">
                                {users[application.userId] && users[application.userId].firstName}{' '}
                                {users[application.userId] && users[application.userId].lastName}
                            </td>
                            <td className="p-4 max-w-[100px] break-words">
                                {users[application.userId] && users[application.userId].email}
                            </td>
                            <td className="p-4 max-w-[100px] break-words">
                                {users[application.userId] && users[application.userId].phone}
                            </td>
                            <td className="p-4 max-w-[150px] break-words">
                                {renderActions(application.status, application._id)}
                            </td>
                            <td className="p-4 text-sm text-gray-800"> {/* Score column */}
                                {application.score }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AllApplications;
