import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10); 
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const candidates = response.data.filter(user => user.role === 'Candidate');
        setTotalUsers(candidates.length);
        setFilteredUsers(candidates);
        setUsers(candidates.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [currentPage, usersPerPage]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = currentPage * usersPerPage;
    setUsers(filteredUsers.slice(startIndex, endIndex));
  }, [filteredUsers, currentPage, usersPerPage]);

  const handleToggleActive = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/users/${userId}`, {
        isActive: !currentStatus,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, isActive: !currentStatus } : user
        )
      );
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    if (term) {
      const filtered = filteredUsers.filter(user =>
        user.email.toLowerCase().includes(term) || `${user.lastName} ${user.firstName}`.toLowerCase().includes(term)
      );
      setFilteredUsers(filtered);
      setTotalUsers(filtered.length);
    } else {
      // Reset search
      setFilteredUsers(users);
      setTotalUsers(users.length);
    }
    setCurrentPage(1); 
  };

  const totalPages = Math.ceil(totalUsers / usersPerPage);

  return (
    <div className="font-[sans-serif] overflow-x-auto">
    
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={handleSearch}
          className="border border-gray-300 px-4 py-2 rounded w-full"
        />
      </div>

      <table className="min-w-full bg-white">
        <thead className="whitespace-nowrap">
          <tr>
            <th className="pl-4 w-8">
              <input id="checkbox" type="checkbox" className="hidden peer" />
              <label
                htmlFor="checkbox"
                className="relative flex items-center justify-center p-0.5 peer-checked:before:hidden before:block before:absolute before:w-full before:h-full before:bg-white w-5 h-5 cursor-pointer bg-blue-500 border border-gray-400 rounded overflow-hidden"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-full fill-white" viewBox="0 0 520 520">
                  <path
                    d="M79.423 240.755a47.529 47.529 0 0 0-36.737 77.522l120.73 147.894a43.136 43.136 0 0 0 36.066 16.009c14.654-.787 27.884-8.626 36.319-21.515L486.588 56.773a6.13 6.13 0 0 1 .128-.2c2.353-3.613 1.59-10.773-3.267-15.271a13.321 13.321 0 0 0-19.362 1.343q-.135.166-.278.327L210.887 328.736a10.961 10.961 0 0 1-15.585.843l-83.94-76.386a47.319 47.319 0 0 0-31.939-12.438z"
                    data-name="7-Check"
                    data-original="#000000"
                  />
                </svg>
              </label>
            </th>
            <th className="p-4 text-left text-sm font-semibold text-black">Name</th>
            <th className="p-4 text-left text-sm font-semibold text-black">Role</th>
            <th className="p-4 text-left text-sm font-semibold text-black">Active</th>
          </tr>
        </thead>

        <tbody className="whitespace-nowrap">
          {users.map((user, index) => (
            <tr key={user._id} className={index % 2 === 0 ? 'odd:bg-blue-200' : ''}>
              <td className="pl-4 w-8">
                <input id={`checkbox${user._id}`} type="checkbox" className="hidden peer" />
                <label
                  htmlFor={`checkbox${user._id}`}
                  className="relative flex items-center justify-center p-0.5 peer-checked:before:hidden before:block before:absolute before:w-full before:h-full before:bg-white w-5 h-5 cursor-pointer bg-blue-500 border border-gray-400 rounded overflow-hidden"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-full fill-white" viewBox="0 0 520 520">
                    <path
                      d="M79.423 240.755a47.529 47.529 0 0 0-36.737 77.522l120.73 147.894a43.136 43.136 0 0 0 36.066 16.009c14.654-.787 27.884-8.626 36.319-21.515L486.588 56.773a6.13 6.13 0 0 1 .128-.2c2.353-3.613 1.59-10.773-3.267-15.271a13.321 13.321 0 0 0-19.362 1.343q-.135.166-.278.327L210.887 328.736a10.961 10.961 0 0 1-15.585.843l-83.94-76.386a47.319 47.319 0 0 0-31.939-12.438z"
                      data-name="7-Check"
                      data-original="#000000"
                    />
                  </svg>
                </label>
              </td>
              <td className="p-4 text-sm">
                <div className="flex items-center cursor-pointer w-max">
                  <img src={user.avatar || 'https://readymadeui.com/profile_4.webp'} className="w-9 h-9 rounded-full shrink-0" alt={user.name} />
                  <div className="ml-4">
                    <p className="text-sm text-black">{`${user.lastName} ${user.firstName}`}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="p-4 text-sm text-black">{user.role}</td>
              <td className="p-4">
                <label className="relative cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={user.isActive}
                    onChange={() => handleToggleActive(user._id, user.isActive)}
                  />
                  <div
                    className={`w-11 h-6 flex items-center bg-gray-300 rounded-full peer-checked:bg-customPurple transition-colors duration-300`}
                  >
                    <div
                      className={`w-5 h-5 bg-white border border-gray-300 rounded-full transform transition-transform duration-300 ${user.isActive ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                  </div>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersTable;

