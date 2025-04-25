import { createContext, useContext, useState } from "react";
import { apiClient } from "../../api/apiClient";
import { executeJwtAuthenticationService } from "../../api/AuthenticationApiService";
import { set } from "react-hook-form";
import { executeCreateUserService } from "../../api/TodoApiService";

// 1. create a context
export const AuthContext = createContext();

// 4. Create a custom hook to use the context - easy to use across the application!
export const useAuth = () => {
  return useContext(AuthContext);
};

// 2. Share the created context with other (children) components

export default function AuthProvider({ children }) {
  // 3. Put some state in the context
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({username: null, email: null, password: null});
  const [token, setToken] = useState(null);

  async function login(email, password) {
    
    try {

      const response = await executeJwtAuthenticationService(email, password);

      if (response.status == 200) {

        const jwtToken = `Bearer ` + response.data.token;
        setUser({username: null, email: email, password: password});
        setIsAuthenticated(true);
        setToken(jwtToken);

        console.log("jwtToken", jwtToken);

        apiClient.interceptors.request.use(
          (config) => {
            console.log('intercepting and adding a token');
            config.headers.Authorization = jwtToken;
            config.headers["Content-Type"] = "application/json";
            config.headers["X-User-Email"] = email;
            return config;
          }
        );

        return true;
      } else {
        logout();
        return false;
      }

    } catch (error) {
      console.error("Login failed", error);
      logout();
      return false;
    }
  }

  async function register(username, email, password, checkbox) {

    try {
      const response = await executeCreateUserService(email, password, username);

      if (response.status == 200) {
        const jwtToken = `Bearer ` + response.data.token;

        setUser({username: username, email: email, password: password});
        setIsAuthenticated(true);
        setToken(jwtToken);
        console.log("jwtToken", jwtToken);

        apiClient.interceptors.request.use(
          (config) => {
            console.log('intercepting and adding a token');
            config.headers.Authorization = jwtToken;
            config.headers["Content-Type"] = "application/json";
            config.headers["X-User-Email"] = email;
            return config;
          }
        );

        return 200;
      } else if (response.status == 409) {
        console.log("User already exists");
        return 409;
      } else {
        return 400;
      }
    } catch (error) {
      console.error("Registration failed", error);
      if (error.status == 409) {
        console.log("User already exists");
        return 409;
      } else if (error.status == 400) {
        console.log("Bad request");
        return 400;
      }
      console.log("Internal server error");
      return 500;
    }
  }

  function logout() {
    setIsAuthenticated(false);
    setUser({ username: null, email: null, password: null });
    setToken(null);
  
    // Clear all API interceptors properly
    apiClient.interceptors.request.clear();
  
    console.log("User logged out, interceptors cleared");
  }
  

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout, user, setUser}} >
      {children}
    </AuthContext.Provider>
  );
}