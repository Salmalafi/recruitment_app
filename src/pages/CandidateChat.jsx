import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { format } from 'date-fns';

const CandidateChat = () => {
  const [acceptedUsers, setAcceptedUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const socket = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    socket.current = io('http://localhost:3000', {
      transports: ['websocket'],
    });

    socket.current.on('connect', () => {
      console.log('Socket connected:', socket.current.id);
    });

    socket.current.on('typing', (senderId) => {
      console.log('Received typing event from:', senderId);
      if (senderId === selectedUser?._id) {
        setIsTyping(true);
      }
    });

    socket.current.on('stopTyping', (senderId) => {
      console.log('Received stop typing event from:', senderId);
      if (senderId === selectedUser?._id) {
        setIsTyping(false);
      }
    });

    socket.current.on('receiveMessage', (message) => {
      console.log("Received a message:", message);
      if (
        (message.senderId === currentUser?._id && message.receiverId === selectedUser?._id) ||
        (message.receiverId === currentUser?._id && message.senderId === selectedUser?._id)
      ) {
        setMessages((prevMessages) => {
          const existingMessage = prevMessages.find((msg) => msg._id === message._id);
          if (existingMessage) {
            return prevMessages;
          }
          return [...prevMessages, message];
        });
      }
    });

    socket.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [currentUser, selectedUser]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (selectedUser) {
      console.log('Emitting typing event');
      socket.current.emit('typing', { senderId: currentUser._id, receiverId: selectedUser._id });

      typingTimeoutRef.current = setTimeout(() => {
        console.log('Emitting stop typing event');
        socket.current.emit('stopTyping', { senderId: currentUser._id, receiverId: selectedUser._id });
      }, 2000); 
    }
  };

  const fetchUsersAndMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found in localStorage');

      const axiosInstance = axios.create({
        headers: { Authorization: `Bearer ${token}` },
      });

      const email = localStorage.getItem('userEmail');
const { data: user } = await axiosInstance.post('http://localhost:3000/users/findByEmail', { email });
setCurrentUser(user);

const url = `http://localhost:3000/messages/${user._id}`;
const { data: conversations } = await axiosInstance.get(url);

const userIds = new Set();
conversations.forEach((msg) => {
  if (msg.receiverId !== user._id) userIds.add(msg.receiverId);
});


      const userPromises = Array.from(userIds).map(async (userId) => {
        const { data: user } = await axiosInstance.get(`http://localhost:3000/users/${userId}`);
        return user;
      });

      const usersData = await Promise.all(userPromises);
      setAcceptedUsers(usersData.map(user => ({ ...user, unreadMessages: 0 })));

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchUsersAndMessages();
  }, []);
  useEffect(() => {
    if (isTyping) {
      console.log(`${selectedUser?.firstName} is typing...`);
    }
  }, [isTyping, selectedUser]);
  
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
   console.log(selectedUser._id);
   console.log(currentUser._id);
        setMessages((prevMessages) => {
          const existingMessageIds = new Set(prevMessages.map((msg) => msg._id));
          const uniqueMessages = messagesData.filter((msg) => !existingMessageIds.has(msg._id));
          return [...prevMessages, ...uniqueMessages];
        });
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [currentUser, selectedUser]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (newMessage.trim() && selectedUser) {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token not found in localStorage');
  
        const axiosInstance = axios.create({
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const message = {
          senderId: currentUser._id,
          receiverId: selectedUser._id,
          content: newMessage,
          timestamp: new Date().toISOString(),
        };
  
        console.log('Sending message:', message);
        await axiosInstance.post('http://localhost:3000/messages', message); 
  
        
        socket.current.emit('sendMessage', message);
  
        setNewMessage('');
        setMessages((prevMessages) => {
          const existingMessage = prevMessages.find((msg) => msg._id === message._id);
          if (existingMessage) {
            return prevMessages;
          }
          return [...prevMessages, message];
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      sendMessage();
    }
  };

  const sortedMessages = messages
    .filter(message => message.timestamp)
    .map(message => ({
      ...message,
      timestamp: message.timestamp || new Date().toISOString()
    }))
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return (
    <div className="flex h-screen antialiased text-gray-800">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
          <div className="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg">
            <div className="h-20 w-20 rounded-full border overflow-hidden">
              <img
                src='https://readymadeui.com/profile_5.webp'
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
                  <div className="ml-2 text-sm font-semibold flex-grow">{`${user.lastName} ${user.firstName}`}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-auto h-full p-6">
          <div className="flex flex-col flex-auto flex-shrink-0  bg-gray-100 h-full p-4">
            <div className="flex flex-col h-full overflow-x-auto mb-4">
              <div className="flex flex-col h-full">
                <div className="space-y-2">
                  {sortedMessages.map((message) => {
                    const isCurrentUserSender = message.senderId === currentUser._id;
                    const senderName = isCurrentUserSender ? currentUser.firstName : selectedUser?.firstName;
                    const formattedTimestamp = format(new Date(message.timestamp), 'MMM d, yyyy h:mm a');

                    return (
                      <div
                        key={message._id}
                        className={`flex ${isCurrentUserSender ? 'justify-end' : 'justify-start'} p-4`}
                      >
                        <div className="flex items-start">
                          {!isCurrentUserSender && (
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 text-white flex-shrink-0">
                              {senderName?.charAt(0).toUpperCase()}
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
                              {senderName?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-gray-100 p-4 ">
            {isTyping && (
              <div className="text-sm text-gray-500 mb-2">
                {`${selectedUser?.firstName} is typing...`}
              </div>
            )}
            <div className="flex flex-row items-center  mt-auto">
              <input
                type="text"
                value={newMessage}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                className="w-full h-12 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Type your message here..."
              />
              <button
                onClick={sendMessage}
                className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl ml-2 text-white px-4 py-1 flex-shrink-0"
              >
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
  );
};

export default CandidateChat;



