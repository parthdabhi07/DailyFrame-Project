import React, { use, useState } from 'react'
import './Signup.css'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/Security/AuthContext';

export default function Signup({ setIsSignin }) {

  const navigate = useNavigate();
  const authContext = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    checkbox: false
    }
  );

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    console.log(name, value);
    setFormData((prevData) => {
      return {
        ...prevData,
        [name]: type === 'checkbox' ? checked : value, // Handle checkbox separately
      };
    });
  };

  const handleSignup = () => {
    setIsSignin(true);
  }

  const handleRegister = async (e) => {
    if(formData.username === "" || formData.email === "" || formData.password === "" || formData.checkbox === false) {
      alert("Please fill all the fields and agree to the terms & conditions.");
      return;
    }
    e.preventDefault();
    const response = await authContext.register(formData.username, formData.email, formData.password, formData.checkbox);

    if(response === 200) {
      alert("Registered successfully!");
      navigate("/todo-dashboard");
    } else if(response === 409) {
      alert("User already exists!, with this email");
    } else if(response === 500) {
      alert("Internal server error!");
    } else if (response === 400) {  
      alert("Bad request!- make sure email and password format is correct");
    } else {
      alert("Please fill all the fields and agree to the terms & conditions.");
    }
  }

  return (
    <>
      <div className="form-box signup">
        <h2>Registration</h2>
        <form action="#">
          <div className="input-box">
            <span className="icon"><i className="fa-solid fa-user"></i></span>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
            <label>Username</label>
          </div>
          <div className="input-box">
            <span className="icon"><i className="fa-solid fa-envelope"></i></span>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            <label>Email</label>
          </div>
          <div className="input-box">
            <span className="icon"><i className="fa-solid fa-lock"></i></span>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            <label>Password</label>
          </div>
          <div className="remember-forgot tandc">
            <label htmlFor="remember">
              <input type="checkbox" name="checkbox" value={formData} onChange={handleChange} /> I agree to the terms & conditions
            </label>
          </div>
          <button type="submit" className="btn" onClick={handleRegister}>Sign Up</button>
          <div className="login-register">
            <p>
              Already have an account? <a className="login-link" onClick={handleSignup}>Login</a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}