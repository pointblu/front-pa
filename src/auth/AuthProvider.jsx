import {
  useContext,
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

import PropTypes from "prop-types";

const AuthContext = createContext({
  isAuthenticated: false,
  getAccessToken: () => "",
  saveUser: () => {},
  getUser: () => {},
  signout: () => {},
});

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [user, setUser] = useState();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    const storedToken = localStorage.getItem("token");
    if (storedToken && userInfo) {
      setUser(userInfo);
      setIsAuthenticated(true);
      setAccessToken(storedToken);
    }
  }, []);

  const getAccessToken = useCallback(() => {
    return accessToken;
  }, [accessToken]);

  const saveUser = useCallback(
    (userData) => {
      setAccessToken(userData.accessToken);
      localStorage.setItem("token", JSON.stringify(userData.accessToken));
      localStorage.setItem("userInfo", JSON.stringify(userData.payload));
      localStorage.setItem("points", JSON.stringify(userData.payload.points));
      localStorage.setItem("isAuth", JSON.stringify(true));

      setIsAuthenticated(true);
    },
    [setAccessToken]
  );

  const getUser = useCallback(() => {
    return user;
  }, [user]);

  const signout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("isAuth");
    localStorage.removeItem("cart");
    localStorage.removeItem("canje");
    setAccessToken("");
    setUser(undefined);
    setIsAuthenticated(false);
    window.location.reload(true);
  }, []);

  const contextValue = useMemo(() => {
    return { isAuthenticated, getAccessToken, saveUser, getUser, signout };
  }, [isAuthenticated, getAccessToken, saveUser, getUser, signout]);
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export const useAuth = () => useContext(AuthContext);
