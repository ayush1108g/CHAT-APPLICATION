import React, { useState, createContext, useEffect } from "react";
import Image1 from "../assets/LOGO.jpg";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DataContext = createContext();

const DataContextProvider = ({ children }) => {
  const [background, setBackground] = useState(Image1);
  const [forwarding, setForwarding] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    const getBackground = async () => {
      const bg = await AsyncStorage.getItem("backgroundimage");
      if (bg) {
        setBackground(JSON.parse(bg));
      }
    };
    getBackground();
  }, []);

  const setBackgroundHandler = async (image) => {
    await AsyncStorage.setItem("backgroundimage", JSON.stringify(image));
    setBackground(image);
  };
  const context = {
    background,
    setBackground: setBackgroundHandler,
    forwarding,
    setForwarding,
    capturedImage,
    setCapturedImage,
  };
  return (
    <DataContext.Provider value={context}>{children}</DataContext.Provider>
  );
};

export { DataContext, DataContextProvider };
