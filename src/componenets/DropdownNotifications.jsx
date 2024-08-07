import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import Transition from '../utils/Transition';
import axios from 'axios';

function DropdownNotifications({ align }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const trigger = useRef(null);
  const dropdown = useRef(null);
  const userEmail = localStorage.getItem('userEmail'); // Get user email from localStorage
  const [currentUser, setCurrentUser] = useState(null);
  const token = localStorage.getItem('token'); // Get the token from localStorage
  const navigate = useNavigate(); // Initialize navigate function

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.post('http://localhost:3000/users/findbyEmail', { email: userEmail });
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    fetchCurrentUser();
  }, [userEmail]);

  // Fetch messages and process notifications
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (currentUser) {
          const response = await axios.get(`http://localhost:3000/messages/${currentUser._id}`, {
            headers: {
              Authorization: `Bearer ${token}` // Add token to headers
            }
          });
          const messages = response.data;

          // Group messages by conversation and get the latest message in each conversation
          const latestMessages = messages.reduce((acc, msg) => {
            if (!acc[msg.conversationId] || new Date(acc[msg.conversationId].timestamp) < new Date(msg.timestamp)) {
              acc[msg.conversationId] = msg;
            }
            return acc;
          }, {});

          // Filter out the messages where the current user is the sender of the last message
          const receivedMessages = Object.values(latestMessages).filter(msg => msg.receiverId === currentUser._id);

          // Fetch sender names and process notifications
          const notificationsList = await Promise.all(
            receivedMessages.map(async (msg) => {
              const senderResponse = await axios.get(`http://localhost:3000/users/${msg.senderId}`, {
                headers: {
                  Authorization: `Bearer ${token}` // Add token to headers
                }
              });

              return {
                ...msg,
                senderName: `${senderResponse.data.lastName} ${senderResponse.data.firstName}`,
                isNew: true, // Assuming all fetched messages are new for demo purposes
              };
            })
          );

          setNotifications(notificationsList);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, [currentUser, token]);

  // Close dropdown if clicking outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [dropdownOpen]);

  // Close dropdown on ESC key
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [dropdownOpen]);

  // Function to navigate to chat page with userId and mark notification as read
  const goToChatPage = (userId, notificationId) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter(notification => notification._id !== notificationId)
    );
    navigate('/dashboardHR/chat', { state: { userId } });
  };

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className={`w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600/80 rounded-full ${dropdownOpen && 'bg-slate-200'}`}
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <span className="sr-only">Notifications</span>
        <svg className="w-4 h-4" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path className="fill-current text-slate-500 dark:text-slate-400" d="M6.5 0C2.91 0 0 2.462 0 5.5c0 1.075.37 2.074 1 2.922V12l2.699-1.542A7.454 7.454 0 006.5 11c3.59 0 6.5-2.462 6.5-5.5S10.09 0 6.5 0z" />
          <path className="fill-current text-slate-400 dark:text-slate-500" d="M16 9.5c0-.987-.429-1.897-1.147-2.639C14.124 10.348 10.66 13 6.5 13c-.103 0-.202-.018-.305-.021C7.231 13.617 8.556 14 10 14c.449 0 .886-.04 1.307-.11L15 16v-4h-.012C15.627 11.285 16 10.425 16 9.5z" />
        </svg>
        {notifications.length > 0 && (
          <div className="absolute top-0 right-0 w-5 h-5 bg-rose-500 border-2 border-white dark:border-[#182235] rounded-full flex items-center justify-center text-xs text-white">{notifications.length}</div>
        )}
      </button>

      <Transition
        className={`origin-top-right z-10 absolute top-full -mr-48 sm:mr-0 min-w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 rounded shadow-lg overflow-hidden mt-1 ${align === 'right' ? 'right-0' : 'left-0'}`}
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase pt-1.5 pb-2 px-4">Notifications</div>
          <ul>
            {notifications.length === 0 ? (
              <li className="block py-2 px-4 text-sm text-slate-500 dark:text-slate-400">No new messages</li>
            ) : (
              notifications.map((notification, index) => (
                <li key={index} className="border-b border-slate-200 dark:border-slate-700 last:border-0">
                  <div
                    className="block py-2 px-4 hover:bg-slate-50 dark:hover:bg-slate-700/20 flex items-center cursor-pointer"
                    onClick={() => {
                      setDropdownOpen(false);
                      goToChatPage(notification.senderId, notification._id); // Pass notificationId to mark it as read
                    }}
                  >
                    <span className="block text-sm mb-2 flex-1">
                      <span className="font-medium text-slate-800 dark:text-slate-100">{notification.senderName}</span>: {notification.content}
                    </span>
                    {notification.isNew && (
                      <div className="w-6 h-6 bg-rose-500 border-2 border-white dark:border-[#182235] rounded-full flex items-center justify-center text-xs text-white ml-2">1</div>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </Transition>
    </div>
  );
}

export default DropdownNotifications;




