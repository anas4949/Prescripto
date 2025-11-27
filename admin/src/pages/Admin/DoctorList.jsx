import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { CheckCircle, XCircle } from "lucide-react";

const DoctorList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } =
    useContext(AdminContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (aToken) {
      getAllDoctors().finally(() => setLoading(false));
    }
  }, [aToken]);

  if (loading) {
    return (
      <div className="m-10 flex justify-center items-center h-64 text-gray-600">
        Loading doctors...
      </div>
    );
  }

  return (
    <div className="m-6 max-h-[90vh] overflow-y-auto">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Doctors List
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {doctors.map((item) => (
          <div
            key={item._id}
            className="border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            {/* IMAGE SECTION */}
            <div className="relative h-48 bg-blue-100 flex items-center justify-center overflow-hidden group">

              {/* Blue Hover Overlay */}
              <div className="absolute inset-0 bg-blue-900 opacity-0 group-hover:opacity-20 transition-all duration-300"></div>

              {/* Doctor Image */}
              <img
                className="h-full object-contain z-10 transition-transform duration-300 group-hover:scale-105"
                src={item.image || item.Image || "/placeholder-doctor.jpg"}
                alt={item.name}
              />

              {/* Status */}
              {item.available ? (
                <span className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1 z-20">
                  <CheckCircle size={12} /> Active
                </span>
              ) : (
                <span className="absolute top-3 right-3 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full flex items-center gap-1 z-20">
                  <XCircle size={12} /> Inactive
                </span>
              )}
            </div>

            {/* DETAILS */}
            <div className="p-4">
              <p className="text-gray-800 text-lg font-medium">{item.name}</p>
              <p className="text-gray-500 text-sm mb-3 capitalize">
                {item.speciality || "General"}
              </p>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="accent-indigo-500 w-4 h-4"
                  checked={item.available}
                  onChange={(e) =>
                    changeAvailability(item._id, e.target.checked)
                  }
                />
                Available
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorList;
