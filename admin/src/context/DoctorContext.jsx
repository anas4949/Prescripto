import React, { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = ({ children }) => {
  const [doctorData, setDoctorData] = useState(null);

  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

 
  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );
  const [appointments, setAppointments] = useState([]);

  const [dashData, setDashData] = useState(false);

  const [profileData, setProfileData] = useState(false)

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/appointments",
        {
          headers: { dtoken: dToken },
        }
      );

      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/complete-appointment",
        { appointmentId },
        { headers: { dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/cancel-appointment",
        { appointmentId },
        { headers: { dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getDastData = async () => {
    try {
      const {data} = await axios.get(backendUrl + '/api/doctor/dashboard',{headers:{dToken}})
      if (data.success) {
        setDashData(data.dashData)
        console.log(data.dashData)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
        console.log(error);
      toast.error(error.message);
    }
  };

  const getProfileData = async () => {
  try {
    console.log("Fetching doctor profile...");
    const { data } = await axios.get(backendUrl + '/api/doctor/profile', {
      headers: { dtoken: dToken } // lowercase to match backend
    });

    if (data.success) {
      setProfileData(data.profileData);
      console.log("Profile Data:", data.profileData);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log("Error fetching profile:", error);
    toast.error(error.message);
  }
};

  const value = {
    doctorData,
    setDoctorData,
    appointments,
    setAppointments,
    loading,
    setLoading,
    dToken,
    setDToken,
    backendUrl,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    dashData,setDashData,getDastData,
    profileData,setProfileData,getProfileData

  };

  return (
    <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
