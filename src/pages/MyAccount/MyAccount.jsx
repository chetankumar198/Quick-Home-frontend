import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MyAccount.module.css";
import { useAuth } from "../../components/context/AuthContext"; // ✅ import AuthContext

const Account = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth(); // ✅ get current user from context

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "male",
    address: "",
    city: "",
    pincode: "",
    newPassword: "",
  });

  // ✅ Load user info from Firebase Auth user
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else {
      const name = currentUser.displayName || "";
      const phone = currentUser.phoneNumber || "";
      const email = currentUser.email || "";

      setForm((prev) => ({
        ...prev,
        firstName: name.split(" ")[0] || "",
        lastName: name.split(" ")[1] || "",
        phone,
        email,
      }));
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(form)); // optional, for local cache
    alert("Changes saved!");
  };

  const handleLogout = async () => {
    await logout(); // ✅ logout from Firebase
    navigate("/login");
  };

  return (
    <div className={styles.accountContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h3>Hello, {form.firstName}</h3>
        <ul>
         
          <li className={styles.active}>⚙️ Profile Info</li>
          <li>🏠 Manage Addresses</li>
          <li>🔒 Change Password</li>
         
        </ul>
      </aside>

      {/* Main Content */}
      <main className={styles.accountContent}>
        <h2>Personal Information</h2>
        <div className={styles.row}>
          <input
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
          />
        </div>

        <div className={styles.row}>
          <label>Gender:</label>
          <label>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={form.gender === "male"}
              onChange={handleChange}
            />
            Male
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={form.gender === "female"}
              onChange={handleChange}
            />
            Female
          </label>
        </div>

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
        />

        <h2>Saved Address</h2>
        <textarea
          name="address"
          placeholder="Full Address"
          value={form.address}
          onChange={handleChange}
        />

        <div className={styles.row}>
          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
          />
          <input
            name="pincode"
            placeholder="Pincode"
            value={form.pincode}
            onChange={handleChange}
          />
        </div>

        <h2>Change Password</h2>
        <input
          name="newPassword"
          placeholder="New Password"
          type="password"
          value={form.newPassword}
          onChange={handleChange}
        />

        <button onClick={handleSave} className={styles.saveBtn}>
          Save Changes
        </button>
      </main>
    </div>
  );
};

export default Account;
