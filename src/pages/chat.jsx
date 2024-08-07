import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { format } from 'date-fns';
import { useLocation } from 'react-router-dom';
import UserInfo from './UserInfoBox';
const Chat = () => {
  const location = useLocation();
  const userIdFromState = location.state?.userId;
  const [acceptedUsers, setAcceptedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const socket = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [showUserInfo, setShowUserInfo] = useState(false);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserInfo(true); 
  };

  const handleCloseUserInfo = () => {
    setShowUserInfo(false);
  };
  useEffect(() => {
    socket.current = io('http://localhost:3000', {
      transports: ['websocket'],
    });

    socket.current.on('connect', () => {
      console.log('Socket connected:', socket.current.id);
    });

    socket.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.current.on('typing', (senderId) => {
      if (senderId === selectedUser?._id) {
        setIsTyping(true);
      }
    });

    socket.current.on('stopTyping', (senderId) => {
      if (senderId === selectedUser?._id) {
        setIsTyping(false);
      }
    });

    socket.current.on('receiveMessage', (message) => {
      if (
        (message.senderId === currentUser?._id && message.receiverId === selectedUser?._id) ||
        (message.receiverId === currentUser?._id && message.senderId === selectedUser?._id)
      ) {
        setMessages((prevMessages) => {
          if (prevMessages.find(msg => msg._id === message._id)) {
            return prevMessages;
          }
          return [...prevMessages, message];
        });
      } else {
        setAcceptedUsers((prevUsers) =>
          prevUsers.map((user) => {
            if (user._id === message.senderId || user._id === message.receiverId) {
              return { ...user, unreadMessages: (user.unreadMessages || 0) + 1 };
            }
            return user;
          })
        );
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [currentUser, selectedUser]);

  useEffect(() => {
    const fetchAcceptedUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token not found in localStorage');

        const axiosInstance = axios.create({
          headers: { Authorization: `Bearer ${token}` },
        });

        const { data: applications } = await axiosInstance.get('http://localhost:3000/applications');
        const acceptedApplications = applications.filter((application) => application.status.includes('Accepted'));

        const userPromises = acceptedApplications.map(async (application) => {
          const { data: user } = await axiosInstance.get(`http://localhost:3000/users/${application.userId}`);
          return user;
        });

        const usersData = await Promise.all(userPromises);
        setAcceptedUsers(usersData.map(user => ({ ...user, unreadMessages: 0 })));
        setFilteredUsers(usersData.map(user => ({ ...user, unreadMessages: 0 })));
      } catch (error) {
        console.error('Error fetching accepted users:', error);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token not found in localStorage');

        const axiosInstance = axios.create({
          headers: { Authorization: `Bearer ${token}` },
        });

        const email = localStorage.getItem('userEmail');
        const { data: user } = await axiosInstance.post('http://localhost:3000/users/findByEmail', { email });
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchAcceptedUsers();
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    setFilteredUsers(
      acceptedUsers.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, acceptedUsers]);

  useEffect(() => {
    if (userIdFromState) {
      const user = acceptedUsers.find(user => user._id === userIdFromState);
      if (user) {
        setSelectedUser(user);
      }
    }
  }, [userIdFromState, acceptedUsers]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (currentUser && selectedUser) {
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error('Token not found in localStorage');

          const axiosInstance = axios.create({
            headers: { Authorization: `Bearer ${token}` },
          });

          const url = `http://localhost:3000/messages/${currentUser._id}/${selectedUser._id}`;
          const { data: messagesData } = await axiosInstance.get(url);

          setMessages(messagesData);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }
    };

    fetchMessages();
  }, [currentUser, selectedUser]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (selectedUser) {
      socket.current.emit('typing', { senderId: currentUser._id, receiverId: selectedUser._id });

      typingTimeoutRef.current = setTimeout(() => {
        socket.current.emit('stopTyping', { senderId: currentUser._id, receiverId: selectedUser._id });
      }, 2000);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && currentUser && selectedUser) {
      const message = {
        senderId: currentUser._id,
        senderRole: 'HrAgent',
        receiverId: selectedUser._id,
        receiverRole: 'Candidate',
        content: newMessage,
        timestamp: new Date().toISOString(),
      };

      if (socket.current) {
        socket.current.emit('sendMessage', message, (response) => {
          if (response.error) {
            console.error('Error sending message:', response.error);
          } else {
            console.log('Message sent successfully:', response);
          }
        });
        setNewMessage(''); 
      } else {
        console.error('Socket is not initialized');
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  const sortedMessages = messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return (
    <div className="flex h-screen antialiased text-gray-800">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
          <div className="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg">
            <div className="h-20 w-20 rounded-full border overflow-hidden">
              <img
                src="https://avatars3.githubusercontent.com/u/2763884?s=128"
                alt="Avatar"
                className="h-full w-full"
              />
            </div>
            <div className="text-sm font-semibold mt-2">
              {currentUser ? `${currentUser.lastName} ${currentUser.firstName}` : 'Loading...'}
            </div>
            <div className="text-xs text-gray-500">
              {currentUser ? currentUser.role : 'Loading role...'}
            </div>
            <div className="flex flex-row items-center mt-3">
              <div className="flex flex-col justify-center h-4 w-8 bg-indigo-500 rounded-full">
                <div className="h-3 w-3 bg-white rounded-full self-end mr-1"></div>
              </div>
              <div className="leading-none ml-1 text-xs">Active</div>
            </div>
          </div>
          <div className="flex flex-col mt-8">
      <div className="flex flex-row items-center justify-between text-xs">
        <span className="font-bold">Active Conversations</span>
        <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
          {filteredUsers.length}
        </span>
      </div>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg"
      />
      <div className="flex flex-col mt-2 space-y-2">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => handleUserClick(user)}
            className={`flex items-center p-2 rounded-lg cursor-pointer ${
              selectedUser?._id === user._id ? 'bg-gray-200' : ''
            }`}
          >
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-500 text-white flex items-center justify-center">
              {user.firstName.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <div className="font-semibold">{user.firstName} {user.lastName}</div>
              <div className="text-xs text-gray-500">{user.role}</div>
            </div>
            {user.unreadMessages > 0 && (
              <div className="ml-auto flex items-center justify-center h-5 w-5 bg-indigo-500 text-white rounded-full text-xs">
                {user.unreadMessages}
              </div>
            )}
          </div>
        ))}
      </div>
      </div>
     
    </div>
        <div className="flex flex-col flex-auto h-full p-6">
          <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
            <div className="flex flex-col h-full overflow-x-auto mb-4">
              <div className="flex flex-col h-full">
                <div className="space-y-2">
                {!selectedUser ? (
  <div className="flex flex-col items-center justify-center mt-20 h-full">
    <p className="text-gray-500 text-lg">Select a conversation to start sending messages</p>
  </div>
) : (
  sortedMessages.map((message) => {
    const isCurrentUserSender = message.senderId === currentUser._id;
    const senderName = isCurrentUserSender ? currentUser.firstName : selectedUser.firstName;
    const formattedTimestamp = format(new Date(message.timestamp), 'MMM d, yyyy h:mm a');

    return (
      <div
        key={message._id}
        className={`flex ${isCurrentUserSender ? 'justify-end' : 'justify-start'} p-4`}
      >
        <div className="flex items-start">
          {!isCurrentUserSender && (
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 text-white flex-shrink-0">
              {senderName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="relative ml-3 text-sm bg-white mr-2 py-2 px-4 shadow rounded-xl">
            <div className="text-xs text-gray-500 mb-1">
              {senderName}
            </div>
            <div>{message.content}</div>
            <div className="text-xs text-gray-400 mt-1">{formattedTimestamp}</div>
          </div>
          {isCurrentUserSender && (
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 text-white flex-shrink-0">
              {currentUser.firstName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
       );
      })
    )}
                    <div ref={messagesEndRef} />
                </div>
              </div>
            </div>

            <div className="relative flex flex-col w-full">
              {isTyping && selectedUser && (
                <div className="absolute top-0 left-0 w-full text-sm text-gray-500 mb-2">
                  {selectedUser.firstName} is typing...
                </div>
              )}
              <div className="flex flex-row items-center h-16 rounded-xl bg-gray-100 w-full px-4 mt-8">
                <div className="flex-grow ml-4">
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyPress}
                      className="w-full h-12 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Type your message here..."
                    />
                  </div>
                </div>
                <div className="ml-4">
                  <button onClick={sendMessage} className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0">
                    <span>Send</span>
                    <span className="ml-2">
                      <svg
                        className="w-4 h-4 transform rotate-45 -mt-px"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        ></path>
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showUserInfo && (
        <UserInfo
          user={selectedUser}
          onClose={handleCloseUserInfo}
        />
      )}
    </div>
  );
};

export default Chat;





