import React, { useState } from "react";
import { FaLocationArrow } from "react-icons/fa";
import { TbCurrentLocation } from "react-icons/tb";

const LocationInput = () => {
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const getAddressFromCoords = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      return data.display_name || "Location not found";
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Unable to fetch address";
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const address = await getAddressFromCoords(latitude, longitude);

        setLocation(address);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching location:", error);
        alert("Please enable GPS to fetch location.");
        setLoading(false);
      }
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xl">
      
      {/* Stylish Input */}
      <div className="relative w-full">
        <FaLocationArrow className="absolute left-3 top-3 text-purple-500 text-lg" />

        <input
          type="text"
          value={location || ""}
          placeholder="Enter your location..."
          readOnly
          className={`w-full pl-10 pr-4 py-3 rounded-xl 
          bg-white/60 backdrop-blur-md shadow-md
          border border-purple-200 text-gray-800
          transition-all duration-300 outline-none focus:ring-2 
          focus:ring-purple-400 ${
            loading ? "animate-pulse bg-purple-50" : ""
          }`}
        />
      </div>

      {/* Location Button */}
      <button
        onClick={getLocation}
        disabled={loading}
        className={`flex items-center gap-2 px-5 py-3 rounded-xl 
        font-semibold text-white shadow-lg transition-all
        ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-blue-500 hover:scale-105 hover:shadow-xl"
        }`}
      >
        <TbCurrentLocation className="text-xl" />
        {loading ? "Locating..." : "Set Location"}
      </button>
    </div>
  );
};

export default LocationInput;
