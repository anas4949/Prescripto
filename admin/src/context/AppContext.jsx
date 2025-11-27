import React, { createContext, useState, } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currency = '$'
const calculateAge = (dob) => {
  if (!dob) return ""; 

  const today = new Date();
  const birthDate = new Date(dob);

  let age = today.getFullYear() - birthDate.getFullYear();


  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
};
const formatDateTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return "";


  let time = timeStr.toUpperCase().trim();


  const dateTimeString = `${dateStr} ${time}`;
  const date = new Date(dateTimeString);

  if (isNaN(date.getTime())) {
    const [year, month, day] = dateStr.split("-");
    let [timePart, meridian] = time.split(" ");
    let [hour, minute] = timePart.split(":").map(Number);

    if (meridian === "PM" && hour < 12) hour += 12;
    if (meridian === "AM" && hour === 12) hour = 0;

    return new Date(year, month - 1, day, hour, minute)
      .toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", "");
  }

  return date.toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};



  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);



  const value = {
    user,
    setUser,
    loading,
    setLoading,
    calculateAge,formatDateTime,currency,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
