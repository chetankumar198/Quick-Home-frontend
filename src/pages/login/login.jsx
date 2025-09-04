import React, { useState } from "react";
import { auth, RecaptchaVerifier } from "../../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
} from "firebase/auth";
import styles from "./login.module.css";

export default function Login() {
  const [method, setMethod] = useState("password"); // password | otp
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // ✅ Handle login with email/password
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful ✅");
    } catch (err) {
      setError(err.message);
    }
  };

  // ✅ Setup Recaptcha
  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      { size: "invisible" },
      auth
    );
  };

  // ✅ Send OTP
  const sendOtp = async () => {
    setError("");
    try {
      setupRecaptcha();
      const confirmation = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier
      );
      setResult(confirmation);
      alert("OTP sent!");
    } catch (err) {
      setError(err.message);
    }
  };

  // ✅ Verify OTP
  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      await result.confirm(otp);
      alert("Phone login successful ✅");
    } catch (err) {
      setError("Invalid OTP");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.card}>
        <h2>Login</h2>

        <div className={styles.switcher}>
          <button onClick={() => setMethod("password")}>Password</button>
          <button onClick={() => setMethod("otp")}>OTP</button>
        </div>

        {method === "password" ? (
          <form onSubmit={handlePasswordLogin} className={styles.form}>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className={styles.form}>
            {!result ? (
              <>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <div id="recaptcha-container"></div>
                <button type="button" onClick={sendOtp}>
                  Send OTP
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <button type="submit">Verify OTP</button>
              </>
            )}
          </form>
        )}

        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}
