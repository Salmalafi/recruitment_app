import React, { useEffect, useState } from 'react';
import API from '../api'; // Adjust the import path according to your project structure
import styles from './signinwithLinkedin.module.css';
import LinkedInIcon from '../assets/linkedin_icon.png';
const SignInWithLinkedIn = () => {
  const [isLoading, setIsLoading] = useState(false); // TypeScript infers 'boolean' type here
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
 
  // Load LinkedIn credentials from environment variables
  const LINKEDIN_ENV = {
    CLIENT_ID: "78zmb8xufig9qm",
    SCOPES: "email profile",
    REDIRECT_URI: "api.linkedin.com/v2/userinfo",
  };
  
  // Handle the client redirection to LinkedIn authentication portal
  const onSignInLinkedIn = () => {
    console.log('Redirecting to LinkedIn authentication portal');
    window.location.replace(
      `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_ENV.CLIENT_ID}&scope=${encodeURIComponent(LINKEDIN_ENV.SCOPES)}&redirect_uri=${encodeURIComponent(LINKEDIN_ENV.REDIRECT_URI)}`
    );
  };
  
  // Check if a LinkedIn authorization code is provided
  useEffect(() => {
    const authorizationCode = new URLSearchParams(window.location.search).get('code');
    console.log('Authorization Code:', authorizationCode);
    if (authorizationCode) {
      setIsLoading(true);
      API.post('linkedin/auth/login', { authorization_code: authorizationCode })
        .then((res) => {
          console.log('API Response:', res.data);
          const { firstName, lastName, email, profileImageUrl } = res.data || {};
          setUsername(`${firstName} ${lastName}`);
          setProfileImageUrl(profileImageUrl);
          setEmail(email);
        })
        .catch((err) => {
          console.error('API Error:', err);
        })
        .finally(() => setIsLoading(false));
    }
  }, []);

  return (
    <div className="App">
      {isLoading ? (
        // Loading
        <div className="Loading">
          <div className="Progress_Bar">
            <div className="Circle Border"></div>
          </div>
          <span>Chargement en cours..</span>
        </div>
      ) : email ? (
        // Current identity from LinkedIn
        <div className="Identity">
          <i>
            Vous êtes connecté(e) à LinkedIn ✅
            <br />
            Voici les informations extraites de votre profil :
          </i>
          <img src={profileImageUrl} className="Profile_Picture" alt={username} />
          <div className="Text_Data">
            <span className="Username">{username}</span>
            <span>({email})</span>
          </div>
        </div>
      ) : (
        // Sign-in with LinkedIn
        <div className={styles.Signin_Content}>
          <div className="Information">
            <span>
              Avant toutes choses,
              <br />
              <br />
              Soyez sûr que les variables d'environnement de l'application{' '}
              <i>
                (fichier <code>.env</code> à la racine du projet)
              </i>
              :&nbsp;
              <code>REACT_APP_LINKEDIN_CLIENT_ID</code>, <code>REACT_APP_LINKEDIN_SCOPES</code>,&nbsp;ainsi
              que <code>REACT_APP_LINKEDIN_REDIRECT_URI</code> soient dûement renseignées par les données
              fournies par&nbsp;
              <a href="https://www.linkedin.com/developers/apps" target="_blank" rel="noreferrer">
                LinkedIn Developers
              </a>{' '}
              pour votre application.
              <br />
              <br />
              Il en va de même pour les variables d'environnement de l'API, à savoir :{' '}
              <code>LINKEDIN_API_CLIENT_ID</code>,&nbsp;<code>LINKEDIN_API_CLIENT_SECRET</code>,&nbsp;ainsi
              que <code>LINKEDIN_API_REDIRECT_URI</code>.
              <br />
              <br />
              PS : L'URI de redirection de l'application ainsi que celle de l'API doivent être identiques et
              préalablement approuvées depuis le panel de votre application LinkedIn. Les scopes renseignés
              doivent également être autorisés.
            </span>
          </div>
          <button className="LinkedIn_Button" onClick={onSignInLinkedIn}>
            <img src={LinkedInIcon} alt="Logo LinkedIn" className="LinkedIn_Icon" />
            <span>Se connecter via LinkedIn</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SignInWithLinkedIn;


