import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-buttonColor4 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
        <ul className="footer-links flex gap-4">
          <li><a href="/terms" className="text- hover:text-white">Terms of Service</a></li>
          <li><a href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
          <li><a href="/contact" className="text-gray-300 hover:text-white">Contact Us</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;

