import React, { useState } from 'react'
import './Navbar.css'
import Logo from "../../assets/logo.png";
import Avatar from "@mui/material/Avatar";
import { useAuth } from '../../context/Security/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { MenuIcon, SearchIcon } = newFunction();

function newFunction() {
  const MenuIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </svg>
  );

  const SearchIcon = () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="#a7d6f9" >
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
  );
  return { MenuIcon, SearchIcon };
}

// state up - toggleSidebar
function Navbar({toggleSidebar, hideHeaderRight = false}) {

  
  const navigate = useNavigate();
  
  const authContext = useAuth();
  const isAuthenticated = authContext.isAuthenticated;
  const message = "Welcome back, " + authContext.user.username + "!";

  const handleLogout = () => {
    authContext.logout();
    navigate("/");
  }

  return (
    <>
      <header className="header">
        <div className="header-left">
          {isAuthenticated && (
            <button className="menu-button-dash" onClick={toggleSidebar}>
              <MenuIcon />
            </button>
          )}

          <div className="logo-dash">
            <a href="/">
              <img src={Logo} alt="Logo" />
            </a>
          </div>
        </div>

        {isAuthenticated && (
          <div className="header-right">
            <h4 className="message-user">{message}</h4>
            
            {/* <div className="search-container">
              <SearchIcon className="search-icon" />
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
              />
              <span className="keyboard-shortcut">Ctrl+K</span>
            </div> */}

            {/* <Avatar className="user-img" /> */}

            <button type="button" className='logout-btn' onClick={handleLogout}>Logout</button>
          </div>
        )}

      </header>
    </>
  );
}

export default React.memo(Navbar);
