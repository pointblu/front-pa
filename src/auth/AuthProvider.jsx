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
  saveUser: (userData) => {},
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
      const fetchChatDelete = async (uid) => {
        try {
          const response = await fetch(
            `https://141d92ac517848f8b435c8ae7b6b2059.weavy.io/api/conversations`,
            {
              method: "GET",
              headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${uid}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const datum = await response.json();

          localStorage.setItem("chatInfo", JSON.stringify(datum));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      const fetchChatAsync = async (uid) => {
        try {
          const response = await fetch(
            `https://141d92ac517848f8b435c8ae7b6b2059.weavy.io/api/users/${uid}`,
            {
              method: "PUT",
              headers: {
                "content-type": "application/json",
                Authorization: `Bearer wys_N5dltymzi3Cni2mxDGs8D7xOn7LKy32iW48Q`,
              },
              body: JSON.stringify(userData.payload),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const datum = await response.json();

          localStorage.setItem("chatInfo", JSON.stringify(datum));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      const fetchChatToken = async (uid) => {
        try {
          const response = await fetch(
            `https://141d92ac517848f8b435c8ae7b6b2059.weavy.io/api/users/${uid}/tokens`,
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
                Authorization: `Bearer wys_N5dltymzi3Cni2mxDGs8D7xOn7LKy32iW48Q`,
              },
              body: "{ 'expires_in': 3456000 }",
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const dates = await response.json();

          localStorage.setItem("chatToken", JSON.stringify(dates));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchChatAsync(userData.payload.userName);
      fetchChatToken(userData.payload.userName);
      const chatToken = localStorage.getItem("chatToken");
      fetchChatDelete(chatToken.access_token);
      setAccessToken(userData.accessToken);
      localStorage.setItem("token", JSON.stringify(userData.accessToken));
      localStorage.setItem("userInfo", JSON.stringify(userData.payload));
      localStorage.setItem("points", JSON.stringify(userData.payload.points));
      localStorage.setItem("isAuth", JSON.stringify(true));

      setIsAuthenticated(true);
    },
    [setAccessToken, accessToken]
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
