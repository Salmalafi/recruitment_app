import React from 'react';
import { useNavigate } from 'react-router-dom';
import myImage from '../assets/capgemini.png';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <nav className="bg-buttonColor4 p-3 h-16  fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <img src={myImage} alt="recrutement" className="h-12 w-auto rounded-full" />
        </div>
        <ul className="flex gap-4 items-center">
          <li><a href="/" className="text-white">Accueil</a></li>
          <li><a href="/equipe" className="text-white">Equipe</a></li>
          <li><a href="/about" className="text-white">À propos</a></li>
          <li>
            <button className="text-white px-3 py-1 rounded-full hover:bg-buttonColor1 hover:text-white" onClick={handleLoginClick}>
              Se connecter
            </button>
          </li>
          <li>
            <button className="text-white px-3 py-1 rounded-full bg-buttonColor1 hover:bg-buttonColor2 hover:text-white" onClick={handleSignUpClick}>
              S'inscrire
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

