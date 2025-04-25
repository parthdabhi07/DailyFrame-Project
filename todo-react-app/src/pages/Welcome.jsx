import React from 'react'
import './Welcome.css'
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'
import Signin from '../components/authentication/Signin/Signin'
import Signup from '../components/authentication/Signup/Signup'
import { useState, useContext } from 'react'
import { AuthContext, useAuth } from '../context/Security/AuthContext'


function Welcome() {

  const [isSignin, setIsSignin] = useState(true);
  // const authContext = useContext(AuthContext);
  const authContext = useAuth();

  return (
    <>
      <Navbar hideHeaderRight={true}/>
        <div className="welcome-container">
          <div className="auth-container">
            {isSignin ? <Signin setIsSignin={setIsSignin}/> : <Signup setIsSignin={setIsSignin}/>}
          </div>
        </div>
      <Footer/>
    </>
  )
}

export default React.memo(Welcome);