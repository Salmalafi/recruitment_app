import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { format } from 'date-fns';
const Chat = () => {
  const [acceptedUsers, setAcceptedUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const socket = useRef(null);

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

    socket.current.on('receiveMessage', (message) => {
      if (
        (message.senderId === currentUser?._id && message.receiverId === selectedUser?._id) ||
        (message.receiverId === currentUser?._id && message.senderId === selectedUser?._id)
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });
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
        setAcceptedUsers(usersData);
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
  
  const sendMessage = () => {
    if (newMessage.trim() && currentUser && selectedUser) {
      const message = {
        senderId: currentUser._id,
        senderRole: 'HrAgent',
        receiverId: selectedUser._id,
        receiverRole: 'Candidate',
        content: newMessage,
        timestamp: new Date().toISOString() 
      };
  
      if (socket.current) {
        socket.current.emit('sendMessage', message, (response) => {
          if (response.error) {
            console.error("Error sending message:", response.error);
          } else {
            console.log("Message sent successfully:", response);
          }
        });
        console.log('Sending message:', message);
        setMessages((prevMessages) => [...prevMessages, message]);
        setNewMessage('');
      } else {
        console.error('Socket is not initialized');
      }
    } else {
      console.warn('Message, currentUser, or selectedUser is missing');
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
            <div className="text-sm font-semibold mt-2">Aminos Co.</div>
            <div className="text-xs text-gray-500">Lead UI/UX Designer</div>
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
              <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">{acceptedUsers.length}</span>
            </div>
            <div className="flex flex-col space-y-1 mt-4 -mx-2 h-48 overflow-y-auto">
              {acceptedUsers.map((user) => (
                <button
                  key={user._id}
                  className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-customBlue">
                    {user.firstName.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-2 text-sm font-semibold">{`${user.lastName} ${user.firstName}`}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-auto h-full p-6">
          <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
            <div className="flex flex-col h-full overflow-x-auto mb-4">
              <div className="flex flex-col h-full">
                <div className="space-y-2">
                  {sortedMessages.map((message) => {
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
                          <div className={`relative ml-3 text-sm bg-white mr-2 py-2 px-4 shadow rounded-xl`}>
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
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
              <div className="flex-grow ml-4">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
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
  );
};

export default Chat;