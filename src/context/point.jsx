import React, { createContext, useContext, useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";

const PointContext = createContext();

export const PointProvider = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem("userInfo")) || {};
  const [points, setPoints] = useState(userData.points || 0);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userInfo")) || {};
    setPoints(userData.points || 0);
  }, []);

  const handleAddPoints = (amount) => {
    userData.points = points + amount;
    setPoints((prevPoints) => prevPoints + amount);
    localStorage.setItem("userInfo", JSON.stringify(userData));
  };

  const handleRemovePoints = (amount) => {
    userData.points = Math.max(points - amount, 0);
    setPoints((prevPoints) => Math.max(prevPoints - amount, 0));
    localStorage.setItem("userInfo", JSON.stringify(userData));
  };

  return (
    <PointContext.Provider
      value={{ points, handleAddPoints, handleRemovePoints }}
    >
      {children}
    </PointContext.Provider>
  );
};

export const usePoints = () => {
  const context = useContext(PointContext);
  if (!context) {
    throw new Error("usePoints debe usarse dentro de un PointProvider");
  }
  return context;
};

export const UserNumber = ({ n }) => {
  const { points } = usePoints();

  const { animatedNumber } = useSpring({
    from: { animatedNumber: 0 },
    animatedNumber: points,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 },
  });

  return <animated.div>{animatedNumber.to((n) => n.toFixed(0))}</animated.div>;
};
