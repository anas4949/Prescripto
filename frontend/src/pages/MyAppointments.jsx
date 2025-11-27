import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyAppointments = () => {
  const { backendUrl, token, refreshDoctorsAfterAppointment } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching appointments");
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await getUserAppointments();
        await refreshDoctorsAfterAppointment();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error cancelling appointment");
    }
  };

  const handleStripePayment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/payment/create-checkout-session",
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Payment error");
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My Appointments</p>
      <div>
        {appointments.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
            key={item._id || index}
          >
            {/* Doctor image */}
            <div>
              <img
                className="w-32 bg-indigo-50 rounded-lg"
                src={item.docData.Image}
                alt={item.docData.name}
              />
            </div>

            {/* Appointment details */}
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Address:</p>
              <p className="text-xs">{item.docData.address?.line2}</p>
              <p className="text-xs">{item.docData.address?.line1}</p>
              <p className="text-sm mt-1">
                <span className="text-sm text-neutral-700 font-medium">Date & Time:</span>{" "}
                {item.slotDate} | {item.slotTime}
              </p>

              <p className="mt-1">
                Status:{" "}
                {item.cancelled ? (
                  <span className="text-red-500 font-semibold">Cancelled</span>
                ) : item.payment ? (
                  <span className="text-green-600 font-semibold">Paid</span>
                ) : (
                  <span className="text-orange-500 font-semibold">Pending</span>
                )}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2 justify-end">
              {/* Paid */}
              {item.payment && !item.cancelled && !item.isCompleted && (
                <button
                  disabled
                  className="text-sm bg-green-100 text-green-600 border border-green-400 rounded py-2 sm:min-w-48"
                >
                  Paid Online
                </button>
              )}

              {/* Pay Online */}
              {!item.cancelled && !item.payment && !item.isCompleted && (
                <button
                  onClick={() => handleStripePayment(item._id)}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                >
                  Pay Online
                </button>
              )}

              {/* Cancel appointment */}
              {!item.cancelled && !item.payment && !item.isCompleted && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Cancel Appointment
                </button>
              )}

              {/* Appointment cancelled */}
              {item.cancelled && !item.isCompleted &&  (
                <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500 bg-red-50 cursor-not-allowed">
                  Appointment Cancelled
                </button>

              )}
              {
                item.isCompleted && <button className="sm:min-w-48 py-2 border-green-500 rounded text-green-500">Completed</button>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
