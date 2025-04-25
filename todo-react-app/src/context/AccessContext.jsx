import { createContext, useContext, useState } from "react";

// 1. create a context
export const AccessContext = createContext();

// 4. Create a custom hook to use the context - easy to use across the application!
export const useAccess = () => {
  return useContext(AccessContext);
};

// 2. Share the created context with other (children) components
export default function AccessProvider({ children }) {
  // 3. Put some state in the context
  const [access, setAccess] = useState(["My Routin"]);

  return (
    <AccessContext.Provider value={{ access, setAccess }}>
      {children}
    </AccessContext.Provider>
  );
}