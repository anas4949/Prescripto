import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);

  //  Filter doctors by speciality
  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(
        doctors.filter(
          (doc) =>
            doc.speciality.toLowerCase().trim() === speciality.toLowerCase().trim()
        )
      );
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  const specialties = [
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist",
  ];

  return (
    <div>
      <p className="text-gray-600 mb-4">
        Browse through the doctors specialist.
      </p>

      <div className="flex flex-col sm:flex-row items-start gap-5">
        {/* Filters */}
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? "bg-primary text-white" : ""
          }`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filters
        </button>

        <div
          className={`flex-col text-sm gap-3 text-gray-600 ${
            showFilter ? "flex" : "hidden sm:flex"
          }`}
        >
          {specialties.map((spec, index) => (
            <p
              key={index}
              onClick={() =>
                speciality === spec
                  ? navigate("/doctors")
                  : navigate(`/doctors/${spec}`)
              }
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-600 rounded cursor-pointer transition-all ${
                speciality === spec ? "bg-indigo-100 text-black" : ""
              }`}
            >
              {spec}
            </p>
          ))}
        </div>

        {/* Doctors list */}
        <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 gap-y-6">
          {filterDoc.length > 0 ? (
            filterDoc.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/appointment/${item._id}`)}
                className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300 bg-white"
              >
                <img
                  className="bg-blue-50 w-full h-48 object-cover"
                  src={item.Image}
                  alt={item.name}
                />
                <div className="p-4">
                   <div className={`flex items-center gap-2 text-center ${item.available ? ' text-green-500':'text-gray-500'}`}>
                <span className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'}  rounded-full`}></span>
                <p>{item.available ? 'Available':'Not Available'}</p>
              </div>
                  <p className="font-medium text-lg text-gray-800">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-600">{item.speciality}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full mt-6">
              No doctors found for this category.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
