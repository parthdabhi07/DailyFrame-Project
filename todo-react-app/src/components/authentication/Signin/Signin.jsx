import React, { use } from "react";
import "./Signin.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/Security/AuthContext"; 

export default function Signin({ setIsSignin }) {

  const navigate = useNavigate();
  const authContext = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [showMessage, setShowMessage] = useState({
    showErrorMessage: false,
  });

  // Now, it Controlled Component
  // this is common handler for all input elements!
  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value);
    setFormData((prevData) => {
      return {
        ...prevData,
        [name]: value, //This updates the specific property in the state object with the new value.
      };
    });
  };

  const handleSignup = () => {
    setIsSignin(false);
  }

  const handleLogin = async (e) => {
    if (formData.email === "" || formData.password === "" || !/\S+@\S+\.\S+/.test(formData.email) || formData.password.length < 6) {
      if (formData.password.length < 6) {
        alert("Password must be at least 6 characters long.");
        e.preventDefault();
        return;
      }
    }
    e.preventDefault();
    if(await authContext.login(formData.email, formData.password)) {
      console.log("going to todo-dashboard");
      navigate("/todo-dashboard");
    } else {
      setShowMessage({
        showErrorMessage: true,
      });
    }
  }

  return (
    <>
      <div className="form-box signin">
        <h2>Login</h2>
        <form action="#">
          <div className="input-box">
            
            <span className="icon">
              <i className="fa-solid fa-envelope"></i>
            </span>
            <input type="email" name="email"  value={formData.email} onChange={handleChange} required />
            <label>Email</label>
          </div>
          <div className="input-box">
            <span className="icon">
              <i className="fa-solid fa-lock"></i>
            </span>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required/>
            <label>Password</label>
          </div>
          <div className="showMessage">
            {showMessage.showErrorMessage && (
              <div className="error-message">
                Invalid email or password!
              </div>
            )}
          </div>
          <div className="remember-forgot" >
            <label htmlFor="forgot-pass">
              Don't know password?
            </label>
            <a href="#" id="forgot-pass">Forgot Password</a>
          </div>

          <button type="submit" className="btn" onClick={handleLogin}>
            Login
          </button>
          <div className="login-register">
            <p>
              Don't have an account?
              &nbsp;
              <a className="register-link" onClick={handleSignup}>
                Signup Now!
              </a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
