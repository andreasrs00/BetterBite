import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    nama: "",
    usia: "",
    tinggi: "",
    berat: "",
    foto_profil: "",
  });

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUserData = localStorage.getItem("userData");

    if (token) {
      setIsLoggedIn(true);
      if (savedUserData) {
        try {
          const parsedData = JSON.parse(savedUserData);
          setUserData(parsedData);
        } catch (error) {
          console.error("Error parsing saved user data:", error);
        }
      }
    }
  }, []);

  const updateUserData = (newData) => {
    console.log("Updating user data in context:", newData);
    const updatedData = {
      ...userData,
      ...newData,
      // Normalize field names if needed
      tinggi: newData.tinggi || newData.tinggiBadan || userData.tinggi,
      berat: newData.berat || newData.beratBadan || userData.berat,
      usia: newData.usia || userData.usia,
      nama: newData.nama || userData.nama,
      foto_profil:
        newData.foto_profil || newData.fotoProfil || userData.foto_profil,
    };

    setUserData(updatedData);

    // Save to localStorage for persistence
    localStorage.setItem("userData", JSON.stringify(updatedData));
  };

  const setLoginStatus = (status) => {
    setIsLoggedIn(status);
    if (!status) {
      // Clear user data on logout
      clearUserData();
    }
  };

  const clearUserData = () => {
    setUserData({
      nama: "",
      usia: "",
      tinggi: "",
      berat: "",
      foto_profil: "",
    });
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
  };

  const value = {
    isLoggedIn,
    userData,
    updateUserData,
    setLoginStatus,
    clearUserData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
