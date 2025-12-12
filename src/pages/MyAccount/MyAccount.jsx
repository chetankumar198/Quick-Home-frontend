// src/pages/Account/Account.jsx
import React, { useEffect, useState, useRef } from "react";
import styles from "./MyAccount.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/context/AuthContext";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
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
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";

/*
  Account page: Tabs - Profile / Addresses / Orders / Security
  - Profile: upload avatar, update name, gender
  - Addresses: auto-fill using geolocation + save to Firestore
  - Orders: basic orders list (reads `orders` collection filtered by uid)
  - Security: update email/password with reauth
*/

const Account = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const uid = currentUser?.uid;

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);

  // Profile form
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    gender: "male",
    phone: "",
    email: "",
    photoURL: "",
  });

  // avatar upload
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // addresses
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    label: "Home",
    address: "",
    city: "",
    pincode: "",
    lat: null,
    lng: null,
  });

  // orders
  const [orders, setOrders] = useState([]);
  const [saving, setSaving] = useState(false);

  // security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    (async () => {
      setLoading(true);
      // load profile doc
      try {
        const userDocRef = doc(db, "users", uid);
        const snap = await getDoc(userDocRef);
        if (snap.exists()) {
          const data = snap.data();
          setProfile((p) => ({
            ...p,
            firstName: data.firstName || currentUser.displayName?.split(" ")[0] || "",
            lastName: data.lastName || currentUser.displayName?.split(" ")[1] || "",
            gender: data.gender || "male",
            phone: currentUser.phoneNumber || data.phone || "",
            email: currentUser.email || data.email || "",
            photoURL: data.photoURL || currentUser.photoURL || "",
          }));
          setAddresses(data.addresses || []);
        } else {
          // fallback to auth info
          setProfile((p) => ({
            ...p,
            firstName: currentUser.displayName?.split(" ")[0] || "",
            lastName: currentUser.displayName?.split(" ")[1] || "",
            phone: currentUser.phoneNumber || "",
            email: currentUser.email || "",
            photoURL: currentUser.photoURL || "",
          }));
        }

        // load recent orders (simple)
        const q = query(collection(db, "orders"), where("userId", "==", uid));
        const qSnap = await getDocs(q);
        setOrders(qSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser, navigate, uid]);

  // handle profile input changes
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // avatar change
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    // show temporary preview via URL
    setProfile((p) => ({ ...p, photoURL: URL.createObjectURL(file) }));
  };

  // upload avatar & save profile to Firestore + updateProfile
  const handleSaveProfile = async () => {
    if (!uid) return;
    setSaving(true);
    try {
      let finalPhotoURL = profile.photoURL;

      if (avatarFile) {
        // upload to storage
        const sRef = storageRef(storage, `profiles/${uid}/avatar_${Date.now()}`);
        const uploadTask = uploadBytesResumable(sRef, avatarFile);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              setUploadProgress(prog);
            },
            (err) => reject(err),
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              finalPhotoURL = url;
              resolve(url);
            }
          );
        });
      }

      // update Firebase Auth profile
      if (finalPhotoURL || profile.firstName || profile.lastName) {
        const displayName = `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
        await updateProfile(auth.currentUser, {
          displayName: displayName || auth.currentUser.displayName,
          photoURL: finalPhotoURL || auth.currentUser.photoURL,
        });
      }

      // save to Firestore
      const userDocRef = doc(db, "users", uid);
      await setDoc(
        userDocRef,
        {
          firstName: profile.firstName,
          lastName: profile.lastName,
          gender: profile.gender,
          email: profile.email,
          phone: profile.phone,
          photoURL: finalPhotoURL || profile.photoURL || auth.currentUser.photoURL || null,
        },
        { merge: true }
      );

      setMessage("Profile saved successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Failed to save profile: " + err.message);
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };

  // add address (auto-fill tries to populate lat/lng + reverse geocode)
  const fillAddressFromGeo = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setNewAddress((n) => ({ ...n, lat: latitude, lng: longitude }));

        // reverse geocode via Nominatim
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const display = data?.display_name || "";
          setNewAddress((n) => ({ ...n, address: display }));
        } catch (err) {
          console.warn("reverse geocode failed", err);
        }
      },
      () => alert("Please allow location permission")
    );
  };

  const handleSaveAddress = async () => {
    if (!uid) return;
    const userDocRef = doc(db, "users", uid);
    try {
      await updateDoc(userDocRef, {
        addresses: arrayUnion({
          ...newAddress,
          createdAt: new Date().toISOString(),
        }),
      });
      setAddresses((a) => [...a, { ...newAddress }]);
      setNewAddress({ label: "Home", address: "", city: "", pincode: "", lat: null, lng: null });
      setMessage("Address saved");
    } catch (err) {
      // if doc not exist, use setDoc
      await setDoc(userDocRef, { addresses: [newAddress] }, { merge: true });
      setAddresses((a) => [...a, { ...newAddress }]);
      setNewAddress({ label: "Home", address: "", city: "", pincode: "", lat: null, lng: null });
      setMessage("Address saved");
    }
  };

  // update email with reauth (prompt current password)
  const handleUpdateEmail = async () => {
    if (!currentUser) return;
    if (!currentPassword) return alert("Enter current password to reauthentication");
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updateEmail(currentUser, newEmail);
      // save also to Firestore
      await updateDoc(doc(db, "users", uid), { email: newEmail });
      setMessage("Email updated successfully");
      setNewEmail("");
      setCurrentPassword("");
    } catch (err) {
      setMessage("Failed to update email: " + err.message);
    }
  };

  // update password
  const handleUpdatePassword = async () => {
    if (!currentUser) return;
    if (!currentPassword) return alert("Enter current password");
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPass);
      setMessage("Password updated successfully");
      setNewPass("");
      setCurrentPassword("");
    } catch (err) {
      setMessage("Failed to update password: " + err.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.accountContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.profileCard}>
          <div className={styles.avatarWrap}>
            <img
              src={profile.photoURL || "/default-avatar.png"}
              alt="avatar"
              className={styles.avatar}
            />
          </div>
          <h3>
            {profile.firstName} {profile.lastName}
          </h3>
          <p className={styles.smallText}>{profile.email}</p>

          <div className={styles.sidebarButtons}>
            <button onClick={() => setActiveTab("profile")} className={activeTab === "profile" ? styles.activeBtn : ""}>Profile</button>
            <button onClick={() => setActiveTab("addresses")} className={activeTab === "addresses" ? styles.activeBtn : ""}>Addresses</button>
            <button onClick={() => setActiveTab("orders")} className={activeTab === "/orders" ? styles.activeBtn : ""}>Orders</button>
            <button onClick={() => setActiveTab("security")} className={activeTab === "security" ? styles.activeBtn : ""}>Security</button>
          </div>

          <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <main className={styles.main}>
        <h2 className={styles.title}>
          {activeTab === "profile" && "Profile"}
          {activeTab === "addresses" && "Addresses"}
          {activeTab === "orders" && "Your Orders"}
          {activeTab === "security" && "Security"}
        </h2>

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <section className={styles.card}>
            <label className={styles.field}>
              <span>First name</span>
              <input name="firstName" value={profile.firstName} onChange={handleProfileChange} />
            </label>

            <label className={styles.field}>
              <span>Last name</span>
              <input name="lastName" value={profile.lastName} onChange={handleProfileChange} />
            </label>

            <label className={styles.field}>
              <span>Gender</span>
              <select name="gender" value={profile.gender} onChange={handleProfileChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className={styles.field}>
              <span>Phone</span>
              <input name="phone" value={profile.phone} onChange={handleProfileChange} />
            </label>

            <label className={styles.field}>
              <span>Photo</span>
              <input type="file" accept="image/*" onChange={onFileChange} />
              {uploadProgress > 0 && <div className={styles.progress}>Uploading: {uploadProgress}%</div>}
            </label>

            <div className={styles.actions}>
              <button onClick={handleSaveProfile} disabled={saving}>{saving ? "Saving..." : "Save Profile"}</button>
            </div>
            {message && <div className={styles.message}>{message}</div>}
          </section>
        )}

        {/* ADDRESSES TAB */}
        {activeTab === "addresses" && (
          <section className={styles.card}>
            <h3>Add an address</h3>
            <label className={styles.field}>
              <span>Label</span>
              <input value={newAddress.label} onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })} />
            </label>

            <label className={styles.field}>
              <span>Address</span>
              <input value={newAddress.address} onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} />
            </label>

            <label className={styles.field}>
              <span>City</span>
              <input value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
            </label>

            <label className={styles.field}>
              <span>Pincode</span>
              <input value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} />
            </label>

            <div className={styles.row}>
              <button onClick={fillAddressFromGeo}>Use current location</button>
              <button onClick={handleSaveAddress}>Save address</button>
            </div>

            <h4>Saved addresses</h4>
            <div className={styles.addressList}>
              {addresses.length === 0 && <p>No saved addresses yet.</p>}
              {addresses.map((a, i) => (
                <div key={i} className={styles.addressItem}>
                  <strong>{a.label}</strong>
                  <div className={styles.smallText}>{a.address}</div>
                </div>
              ))}
            </div>
            {message && <div className={styles.message}>{message}</div>}
          </section>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <section className={styles.card}>
            {orders.length === 0 && <p>No orders yet — place your first booking!</p>}
            {orders.map((o) => (
              <div key={o.id} className={styles.orderItem}>
                <div><strong>Order #{o.id}</strong></div>
                <div>Status: {o.status || "pending"}</div>
                <div>Placed: {o.createdAt || o.created || "—"}</div>
                <div>Total: ₹{o.total || "—"}</div>
              </div>
            ))}
          </section>
        )}

        {/* SECURITY TAB */}
        {activeTab === "security" && (
          <section className={styles.card}>
            <h3>Update email</h3>
            <label className={styles.field}>
              <span>New email</span>
              <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            </label>

            <label className={styles.field}>
              <span>Current password (required)</span>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </label>

            <div className={styles.row}>
              <button onClick={handleUpdateEmail}>Change Email</button>
            </div>

            <hr />

            <h3>Change password</h3>
            <label className={styles.field}>
              <span>New password</span>
              <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
            </label>

            <label className={styles.field}>
              <span>Current password (required)</span>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </label>

            <div className={styles.row}>
              <button onClick={handleUpdatePassword}>Change Password</button>
            </div>

            {message && <div className={styles.message}>{message}</div>}
          </section>
        )}
      </main>
    </div>
  );
};

export default Account;
