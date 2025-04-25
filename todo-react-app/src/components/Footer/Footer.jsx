import React from "react";
import Logo from '../../assets/logo.png'
import "./Footer.css";
export default function Footer() {
  return (
    <>
      <div className="footer-container">
        <a href="/">
          <img src={Logo} alt="Logo" />
        </a>
        <p>© 2025 Strak. All Rights Reserved.</p>
      </div>
    </>
  );
}
