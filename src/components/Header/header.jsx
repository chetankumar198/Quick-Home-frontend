import React, { useState, useRef, useEffect, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import axios from "axios";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";


// CSS
import styles from "./header.module.css";

// Assets
import logo from "../../assets/logo.png";
import SearchIcon from "../../assets/search.png";
import CartIcon from "../../assets/addtocart.png";
import ProfileIcon from "../../assets/signup.png";
import MenuIcon from "../../assets/menu.png";
import CloseIcon from "../../assets/close.png";
import LocationMarkerIcon from "../../assets/Location.png";  // 🔥 FIXED MARKER ICON

// Icons
import { FaUserTie, FaUtensils, FaBroom, FaCar, FaTshirt } from "react-icons/fa";

// Context
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

/* =========================================================
   LOCATION MODAL COMPONENT
========================================================= */
const LocationSelector = ({ onClose, onSetLocation }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [markerPos, setMarkerPos] = useState([22.5726, 88.3639]); // Kolkata default
  const mapRef = useRef(null);
  const [address, setAddress] = useState("");

  const searchPlaces = useCallback(
    debounce(async (q) => {
      if (!q || q.length < 3) return setSuggestions([]);
      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${q}&countrycodes=IN`
        );
        setSuggestions(res.data || []);
      } catch (err) {}
    }, 300),
    []
  );

  useEffect(() => () => searchPlaces.cancel(), [searchPlaces]);

  const handleSelect = async (place) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    setMarkerPos([lat, lon]);
    setQuery(place.display_name);
    setSuggestions([]);

    try {
      const r = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      setAddress(r.data?.display_name);
    } catch (e) {}

    if (mapRef.current) mapRef.current.setView([lat, lon], 13);
  };

  const useCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setMarkerPos([latitude, longitude]);

        const r = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        setAddress(r.data?.display_name);
        setQuery(r.data?.display_name);
      },
      () => alert("Unable to fetch location")
    );
  };

  /* ---------- MAP MARKER ---------- */
  const MapMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPos([lat, lng]);
      },
    });

    return (
      <Marker
        position={markerPos}
        icon={L.icon({
          iconUrl: LocationMarkerIcon, // 🔥 FIXED IMPORTED ICON
          iconSize: [40, 40],         // ✔ Visible size
          iconAnchor: [20, 40],       // ✔ Pin sits correctly on map
        })}
      />
    );
  };

  return (
    <div className={styles.locationPopup}>
      <div className={styles.popupHeader}>
        <h3>Select delivery address</h3>
        <button className={styles.iconBtn} onClick={onClose}>✕</button>
      </div>

      <div className={styles.locationSearchRow}>
        <input
          placeholder="Search area, street..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            searchPlaces(e.target.value);
          }}
          className={styles.locationInput}
        />

        <button className={styles.useLocationBtn} onClick={useCurrentLocation}>
          📍
        </button>
      </div>

      {suggestions.length > 0 && (
        <ul className={styles.suggestionsList}>
          {suggestions.map((s, i) => (
            <li key={i} onClick={() => handleSelect(s)}>
              {s.display_name}
            </li>
          ))}
        </ul>
      )}

      <div className={styles.mapWrapper}>
        <MapContainer
          center={markerPos}
          zoom={13}
          whenCreated={(map) => (mapRef.current = map)}
          className={styles.mapContainer}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapMarker />
        </MapContainer>
      </div>

      <div className={styles.popupFooter}>
        <button
          className={styles.confirmBtn}
          onClick={() => {
            if (!address && !query) return alert("Choose a location");
            onSetLocation(address || query);
            onClose();
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

/* =========================================================
   MAIN HEADER
========================================================= */
const Header = () => {
  const { currentUser, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Select location");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const services = [
    { id: 1, name: "Hire Maid", icon: <FaUserTie />, path: "maid" },
    { id: 2, name: "Hire Cook", icon: <FaUtensils />, path: "cook" },
    { id: 3, name: "Hire Helper", icon: <FaBroom />, path: "helper" },
    { id: 4, name: "Hire Driver", icon: <FaCar />, path: "driver" },
    { id: 5, name: "Laundry & Ironing", icon: <FaTshirt />, path: "laundry" },
    { id: 6, name: "Cleaning", icon: <FaBroom />, path: "cleaning" },
  ];

  /* Auto-detect location on mount */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const r = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      if (r.data?.display_name) setSelectedLocation(r.data.display_name);
    });
  }, []);

  /* Search filter */
  useEffect(() => {
    if (!q) return setFiltered([]);
    setFiltered(
      services.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()))
    );
  }, [q]);

  const goToService = (path) => {
    navigate(`/products/${path}`);
    setQ("");
    setFiltered([]);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>

          {/* LEFT */}
          <div className={styles.left}>
            <button className={styles.menuBtn} onClick={() => setShowSidebar(true)}>
              <img src={MenuIcon} alt="menu" />
            </button>

            <NavLink to="/" className={styles.logoLink}>
              <img src={logo} className={styles.logoImage} alt="QuickHome" />
            </NavLink>

            {/* LOCATION BUTTON */}
            <div
              className={styles.headerLocation}
              onClick={() => setShowLocationModal(true)}
            >
              <span className={styles.headerLocationIcon}>📍</span>
              <div className={styles.headerLocationText}>
                <span className={styles.locLabel}>Deliver to</span>
                <span className={styles.locValue}>
                  {selectedLocation.split(",")[0]}
                </span>
              </div>
            </div>
          </div>

          {/* CENTER SEARCH */}
          <div className={styles.center}>
            <div className={styles.searchBox}>
              <img src={SearchIcon} className={styles.searchIcon} />
              <input
                className={styles.searchInput}
                placeholder="Search for a service"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            {filtered.length > 0 && (
              <div className={styles.suggestions}>
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    className={styles.suggestion}
                    onClick={() => goToService(item.path)}
                  >
                    {item.icon} &nbsp; {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT NAV */}
          <div className={styles.right}>
            <NavLink to="/products" className={styles.navItem}>Products</NavLink>
            <NavLink to="/" className={styles.navItem}>Home</NavLink>
            <NavLink to="/about" className={styles.navItem}>About</NavLink>

            {/* CART */}
            <NavLink to="/cart" className={styles.cartLink}>
              <img src={CartIcon} className={styles.cartIcon} />
              {cart.length > 0 && (
                <span className={styles.cartCount}>{cart.length}</span>
              )}
            </NavLink>

            {/* USER MENU */}
            {currentUser ? (
              <div className={styles.profileWrapper}>
                <button
                  className={styles.accountBtn}
                  onClick={() => setShowProfileMenu((v) => !v)}
                >
                  <img src={ProfileIcon} className={styles.profileIcon} />
                  <span className={styles.usernameText}>
                    {currentUser.displayName || "User"}
                  </span>
                </button>

                {showProfileMenu && (
                  <div className={styles.dropdownMenu}>
                    <button onClick={() => navigate("/account")}>My Account</button>
                    <button onClick={() => navigate("/orders")}>Orders</button>
                    <button onClick={logout}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink to="/signup" className={styles.accountBtn}>
                <img src={ProfileIcon} className={styles.profileIcon} />
                <span className={styles.usernameText}>Sign In</span>
              </NavLink>
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className={`${styles.sidebar} ${showSidebar ? styles.open : ""}`}>
          <button className={styles.iconBtn} onClick={() => setShowSidebar(false)}>
           <button className={styles.sidebarCloseBtn} onClick={() => setShowSidebar(false)}>
  <img src={CloseIcon} alt="close" />
</button>
          </button>

          <nav className={styles.sidebarNav}>
            <NavLink to="/" onClick={() => setShowSidebar(false)}>Home</NavLink>
            <NavLink to="/products" onClick={() => setShowSidebar(false)}>Products</NavLink>
            <NavLink to="/about" onClick={() => setShowSidebar(false)}>About</NavLink>
            <NavLink to="/contact" onClick={() => setShowSidebar(false)}>Contact</NavLink>
          </nav>
        </aside>
      </header>

      {/* LOCATION MODAL */}
      {showLocationModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowLocationModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <LocationSelector
              onClose={() => setShowLocationModal(false)}
              onSetLocation={(loc) => setSelectedLocation(loc)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
