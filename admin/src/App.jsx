import React from "react";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminContextProvider, { AdminContext } from "./context/AdminContext";
import DoctorContextProvider, { DoctorContext } from "./context/DoctorContext";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import Allapointments from "./pages/Admin/Allapointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorList from "./pages/Admin/DoctorList";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard"
import DoctorAppointments from "./pages/Doctor/DoctorAppointments"
import DoctorProfile from "./pages/Doctor/DoctorProfile"

const App = () => {
  return (
    <AdminContextProvider>
      <DoctorContextProvider>
        <AppContent />
      </DoctorContextProvider>
    </AdminContextProvider>
  );
};

const AppContent = () => {
  const { aToken } = React.useContext(AdminContext);
  const { dToken } = React.useContext(DoctorContext);

 
    return aToken || dToken ? (
      <div className="bg-[#F8F9FD]">
        <ToastContainer />
        <Navbar />
        <div className="flex items-start">
          <Sidebar />
          <Routes>
            {/* ADMIN ROUTES */}
            <Route path="/" element={<></>} />
            <Route path="/admin-dashboard" element={<Dashboard />} />
            <Route path="/all-appointment" element={<Allapointments />} />
            <Route path="/add-doctor" element={<AddDoctor />} />
            <Route path="/doctor-list" element={<DoctorList />} />
            {/* DOCTOR ROUTES */}
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor-appointments" element={<DoctorAppointments />} />
            <Route path="/doctor-profile" element={<DoctorProfile />} />
          </Routes>
        </div>
      </div>
    ): (
    <>
      <Login />
      <ToastContainer />
    </>
    )
  }

export default App;
