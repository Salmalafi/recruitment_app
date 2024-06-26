import React from 'react';
import { Link } from 'react-router-dom';
import myImage from '../assets/capgemini.png';

const Navbar = () => {
  return (
    <nav className="bg-buttonColor4 p-3 h-16 fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold flex items-center">
          <img src={myImage} alt="recrutement" className="h-12 w-auto rounded-full" />
        </Link>
        <ul className="flex gap-4 items-center">
          <li><Link to="/" className="text-white">Acceuil</Link></li>
          <li><Link to="/jobs" className="text-white">Equipe</Link></li>
          <li><Link to="/about" className="text-white">A propos</Link></li>
          <li className="ml-auto"> 
            <button className="bg-buttonColor1 text-white px-3 py-1 rounded-full hover:bg-buttonColor2">Se connecter</button>
          </li>
          <li> 
            <button className="bg-buttonColor2 text-white px-3 py-1 rounded-full hover:bg-buttonColor1">S'inscrire</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;



