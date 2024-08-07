import React from 'react';

const Avatar = ({ name }) => {
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.split(' ');
    return parts.map(part => part.charAt(0).toUpperCase()).join('');
  };

  return (
    <div className="w-32 h-32 flex items-center justify-center bg-indigo-300 text-white text-3xl font-bold rounded-full  overflow-hidden mb-4">
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
