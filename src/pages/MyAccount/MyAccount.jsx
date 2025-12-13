// src/pages/Account/Account.jsx
import React, { useEffect, useState } from "react";
import styles from "./MyAccount.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/context/AuthContext";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import {
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { auth, db, storage } from "../../firebase";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

/*
  Account page (FAST VERSION)
  Tabs:
  - Profile
  - Addresses
  - Security
*/

const Account = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const uid = currentUser?.uid;

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Profile
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    gender: "male",
    phone: "",
    email: "",
    photoURL: "",
  });

  // Avatar upload
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Addresses
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    label: "Home",
    address: "",
    city: "",
    pincode: "",
    lat: null,
    lng: null,
  });

  // Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPass, setNewPass] = useState("");

  /* =========================================================
     LOAD USER DATA (FAST)
  ========================================================= */
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const userDocRef = doc(db, "users", uid);
        const snap = await getDoc(userDocRef);

        if (snap.exists()) {
          const data = snap.data();
          setProfile({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            gender: data.gender || "male",
            phone: currentUser.phoneNumber || "",
            email: currentUser.email || "",
            photoURL: data.photoURL || currentUser.photoURL || "",
          });
          setAddresses(data.addresses || []);
        } else {
          // fallback to auth data
          setProfile({
            firstName: currentUser.displayName?.split(" ")[0] || "",
            lastName: currentUser.displayName?.split(" ")[1] || "",
            gender: "male",
            phone: currentUser.phoneNumber || "",
            email: currentUser.email || "",
            photoURL: currentUser.photoURL || "",
          });
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [currentUser, navigate, uid]);

  /* =========================================================
     PROFILE HANDLERS
  ========================================================= */
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setProfile((p) => ({ ...p, photoURL: URL.createObjectURL(file) }));
  };

  const handleSaveProfile = async () => {
    if (!uid) return;
    setSaving(true);
    setMessage("");

    try {
      let finalPhotoURL = profile.photoURL;

      if (avatarFile) {
        const sRef = storageRef(storage, `profiles/${uid}/avatar_${Date.now()}`);
        const uploadTask = uploadBytesResumable(sRef, avatarFile);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snap) => {
              const percent = Math.round(
                (snap.bytesTransferred / snap.totalBytes) * 100
              );
              setUploadProgress(percent);
            },
            reject,
            async () => {
              finalPhotoURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      const displayName = `${profile.firstName} ${profile.lastName}`.trim();

      await updateProfile(auth.currentUser, {
        displayName,
        photoURL: finalPhotoURL || null,
      });

      await setDoc(
        doc(db, "users", uid),
        {
          firstName: profile.firstName,
          lastName: profile.lastName,
          gender: profile.gender,
          phone: profile.phone,
          email: profile.email,
          photoURL: finalPhotoURL || null,
        },
        { merge: true }
      );

      setMessage("Profile updated successfully ✅");
    } catch (err) {
      setMessage("Failed to save profile: " + err.message);
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };

  /* =========================================================
     ADDRESS HANDLERS
  ========================================================= */
  const fillAddressFromGeo = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await res.json();

        setNewAddress((n) => ({
          ...n,
          address: data.display_name || "",
          lat: latitude,
          lng: longitude,
        }));
      } catch {
        alert("Failed to fetch address");
      }
    });
  };

  const handleSaveAddress = async () => {
    if (!uid) return;

    try {
      await updateDoc(doc(db, "users", uid), {
        addresses: arrayUnion({
          ...newAddress,
          createdAt: new Date().toISOString(),
        }),
      });

      setAddresses((a) => [...a, newAddress]);
      setNewAddress({
        label: "Home",
        address: "",
        city: "",
        pincode: "",
        lat: null,
        lng: null,
      });
      setMessage("Address saved ✅");
    } catch (err) {
      setMessage("Failed to save address");
    }
  };

  /* =========================================================
     SECURITY
  ========================================================= */
  const handleUpdateEmail = async () => {
    try {
      const cred = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, cred);
      await updateEmail(currentUser, newEmail);
      await updateDoc(doc(db, "users", uid), { email: newEmail });
      setMessage("Email updated successfully ✅");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const cred = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, cred);
      await updatePassword(currentUser, newPass);
      setMessage("Password updated successfully ✅");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  /* =========================================================
     RENDER
  ========================================================= */
  return (
    <div className={styles.accountContainer}>
      {loading && <div className={styles.loading}>Loading…</div>}

      <aside className={styles.sidebar}>
        <div className={styles.profileCard}>
          <img
            src={profile.photoURL || "/default-avatar.png"}
            className={styles.avatar}
            alt="Profile"
          />
          <h3>{profile.firstName} {profile.lastName}</h3>
          <p className={styles.smallText}>{profile.email}</p>

          <button onClick={() => setActiveTab("profile")}>Profile</button>
          <button onClick={() => setActiveTab("addresses")}>Addresses</button>
          <button onClick={() => setActiveTab("security")}>Security</button>

          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        {activeTab === "profile" && (
          <section className={styles.card}>
            <input placeholder="First Name" name="firstName" value={profile.firstName} onChange={handleProfileChange} />
            <input placeholder="Last Name" name="lastName" value={profile.lastName} onChange={handleProfileChange} />
            <select name="gender" value={profile.gender} onChange={handleProfileChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input type="file" onChange={onFileChange} />
            <button onClick={handleSaveProfile}>
              {saving ? "Saving…" : "Save Profile"}
            </button>
          </section>
        )}

        {activeTab === "addresses" && (
          <section className={styles.card}>
            <input placeholder="House Name" value={newAddress.label} onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })} />
            <input placeholder="Address" value={newAddress.address} onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} />
            <button onClick={fillAddressFromGeo}>Use Current Location</button>
            <button onClick={handleSaveAddress}>Save Address</button>
          </section>
        )}

        {activeTab === "security" && (
          <section className={styles.card}>
            <input placeholder="New Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            <input type="password" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            <button onClick={handleUpdateEmail}>Update Email</button>

            <input type="password" placeholder="New Password" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
            <button onClick={handleUpdatePassword}>Update Password</button>
          </section>
        )}

        {message && <div className={styles.message}>{message}</div>}
      </main>
    </div>
  );
};

export default Account;
