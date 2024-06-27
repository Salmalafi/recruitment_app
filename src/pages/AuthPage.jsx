import React from 'react';
import { useLocation } from 'react-router-dom';
import Login from './login';
import SignUp from './signup';


const AuthPage = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div className="container mx-auto mt-8">
      {isLogin ? <Login></Login> : <SignUp></SignUp>}
    </div>
  );
};

export default AuthPage;
