import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const DoctorAppointments = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
  const { calculateAge, formatDateTime, currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) getAppointments();
  }, [dToken]);

  return (
    <div className="w-full max-w-6xl mx-auto mt-6">
      <p className="mb-4 text-xl font-semibold">All Appointments</p>

      <div className="bg-white border rounded-xl shadow-sm text-sm max-h-[80vh] overflow-y-auto">
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr] py-4 px-6 border-b bg-gray-50 font-medium text-gray-700">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p className="text-center">Action</p>
        </div>

        {/* Table Rows */}
        {[...appointments].reverse().map((item, index) => (
          <div
            key={index}
            className="sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr] items-center text-gray-600 py-4 px-6 border-b hover:bg-gray-100 transition rounded-lg flex flex-wrap justify-between sm:gap-0 gap-4"
          >
            {/* Serial */}
            <p className="hidden sm:block font-medium">{index + 1}</p>

            {/* Patient */}
            <div className="flex items-center gap-3">
              <img
                className="w-10 h-10 rounded-full object-cover border"
                src={item.userData.image}
                alt=""
              />
              <p className="font-medium">{item.userData.name}</p>
            </div>

            {/* Payment */}
            <p>
              {item.payment ? (
                <span className="text-green-600 text-xs inline border border-primary px-2 rounded-full">
                  Online
                </span>
              ) : (
                <span className="text-gray-700 text-xs inline border border-primary px-2 rounded-full">
                  CASH
                </span>
              )}
            </p>

            {/* Age */}
            <p>{calculateAge(item.userData.age)}</p>

            {/* Date & Time */}
            <p className="text-gray-700">
              {formatDateTime(item.slotDate, item.slotTime)}
            </p>

            {/* Fees */}
            <p className="font-medium">
              {currency}
              {item.amount}
            </p>
            {item.cancelled ? (
              <p className="text-red-600 text-sm font-medium">Canceled</p>
            ) : item.isCompleted ? (
              <p className="text-green-700 text-sm font-medium">Completed</p>
            ) : (
              <div className="flex items-center gap-4 justify-center">
                <img
                  onClick={() => cancelAppointment(item._id)}
                  className="w-10 cursor-pointer"
                  src={assets.cancel_icon}
                  alt="Cancel"
                />
                <img
                  onClick={() => completeAppointment(item._id)}
                  className="w-10 cursor-pointer"
                  src={assets.tick_icon}
                  alt="Confirm"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointments;
