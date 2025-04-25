import React from "react";
import "./Signin.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Security/AuthContext";
import { useForm } from "react-hook-form";

export default function Signin({ setIsSignin }) {
  const navigate = useNavigate();
  const authContext = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSignup = () => {
    setIsSignin(false);
  };

  const handleLogin = (data) => {
    // Dummy login logic
    if (authContext.login(data.email, data.password)) {
      navigate("/todo-dashboard");
    } else {
      // Handle error message inside form state
    }
  };

  return (
    <>
      <div className="form-box signin">
        <h2>Login</h2>
        <form onSubmit={handleSubmit(handleLogin)}>
          <div className="input-box">
            <span className="icon">
              <i className="fa-solid fa-envelope"></i>
            </span>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
            />
            <label>Email</label>
            {errors.email && <p className="error-message">{errors.email.message}</p>}
          </div>
          <div className="input-box">
            <span className="icon">
              <i className="fa-solid fa-lock"></i>
            </span>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
            />
            <label>Password</label>
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </div>
          <div className="remember-forgot">
            <label htmlFor="forgot-pass">Don't know password?</label>
            <a href="#" id="forgot-pass">Forgot Password</a>
          </div>
          <button type="submit" className="btn">
            Login
          </button>
          <div className="login-register">
            <p>
              Don't have an account? &nbsp;
              <a href="#" className="register-link" onClick={handleSignup}>
                Signup Now!
              </a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}