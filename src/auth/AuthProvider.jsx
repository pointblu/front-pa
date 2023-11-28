import { useContext, createContext, useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
const AuthContext = createContext({ isAuthenticated: true });

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    // Tu lógica de autenticación, si es necesario
  }, []);

  const contextValue = useMemo(() => {
    return { isAuthenticated };
  }, [isAuthenticated]);
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export const useAuth = () => useContext(AuthContext);
