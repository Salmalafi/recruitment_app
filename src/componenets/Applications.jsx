import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { CircleCheck, CircleX, MessageCircleMore } from 'lucide-react';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [users, setUsers] = useState({});
    const { id } = useParams();
 
    const token = localStorage.getItem('token');
    const navigate = useNavigate(); 
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/applications/offer/${id}`,
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

        if (id) {
            fetchApplications();
        }
    }, [id]);

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

    const renderActions = (status, applicationId) => {
        return (
            <div>
                {status === 'PENDING' && (
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
                )}
                {status === 'Accepted for 1st Interview' && (
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
                )}
                {status === 'Accepted for In-Depth Interview' && (
                    <div>
                        <div className="text-sm justify-center text-gray-700">Hire:</div>
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
                )}
            </div>
        );
    };

    const renderChatIcon = (status, userId) => {
        return (
            status.includes('Accepted') && (
                <div className="flex items-center justify-center">
                    <button
                        className="text-blue-500 focus:outline-none"
                        onClick={() => goToChatPage(userId)} 
                    >
                    <MessageCircleMore size={30} />
                    </button>
                </div>
            )
        );
    };
    const goToChatPage = (userId) => {
        navigate('/dashboardHR/chat', { state: { userId } });
      };
    return (
        <div className="font-sans overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead className="whitespace-nowrap">
                    <tr>
                        <th className="p-4 text-left text-sm font-semibold text-gray-800">
                            Application ID
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-800">
                            Status
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-800">
                            Resume
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-800">
                            Candidate Name
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-800">
                            Email
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-800">
                            Phone
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-800">
                            Actions
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-800">
                         
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {applications.map((application) => (
                        <tr key={application._id} className="text-gray-700">
                            <td className="p-4 max-w-[100px]  text-xs break-words">
                                {application._id}
                            </td>
                            <td className="p-4 text-sm text-gray-800">
                                <span
                                    className="w-[68px] block text-center py-1 border border-green-500 text-green-600 rounded text-xs"
                                >
                                    {application.status}
                                </span>
                            </td>
                            <td className="p-4 text-sm font-semibold text-gray-800">
                                <div className="flex items-center">
                                    <Viewer
                                        fileUrl={`http://localhost:3000/applications/resume/${application.resume}`}
                                        httpHeaders={{ Authorization: `Bearer ${token}` }}
                                        defaultScale={0.05}
                                        hideRotation
                                    />
                                    <div className="w-3"></div>
                                    <button
                                        className="bg-buttonColor2 hover:bg-blue-700 text-gray-900 h-8 w-20 font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                                        onClick={() => downloadFile(`http://localhost:3000/applications/resume/${application.resume}`)}
                                    >
                                        Download
                                    </button>
                                </div>
                            </td>
                            <td className="p-4">
                                {users[application.userId] ? (
                                    `${users[application.userId].firstName} ${users[application.userId].lastName}`
                                ) : (
                                    <span className="text-gray-400">Fetching...</span>
                                )}
                            </td>
                            <td className="p-4">
                                {users[application.userId] ? (
                                    <button
                                        className="text-blue-500 underline"
                                        onClick={() => {
                                            alert(`Email: ${users[application.userId].email}\nPhone: ${users[application.userId].phone}`);
                                        }}
                                    >
                                        {users[application.userId].email}
                                    </button>
                                ) : (
                                    <span className="text-gray-400">Fetching...</span>
                                )}
                            </td>
                            <td className="p-4">
                                {users[application.userId] ? (
                                    users[application.userId].phone
                                ) : (
                                    <span className="text-gray-400">Fetching...</span>
                                )}
                            </td>
                            <td className="p-4">
                                {renderActions(application.status, application._id)}
                            </td>
                            <td className="p-4">
                                {renderChatIcon(application.status, application.userId)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Applications;


