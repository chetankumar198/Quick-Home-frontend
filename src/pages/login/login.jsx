import React, { useState, useRef } from "react";
import { auth, RecaptchaVerifierInstance, googleProvider } from "../../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
} from "firebase/auth";

import styles from "./login.module.css";

// Icons
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [method, setMethod] = useState("password"); // password | otp
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState("");

  const otpRefs = useRef([]);

  /* ---------------------------------------
     PASSWORD LOGIN
  --------------------------------------- */
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful 🎉");
      window.location.href = "/";
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  /* ---------------------------------------
     SETUP RECAPTCHA
  --------------------------------------- */
  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      { size: "invisible" },
      auth
    );
  };

  /* ---------------------------------------
     SEND OTP
  --------------------------------------- */
  const sendOtp = async () => {
    if (!phone.startsWith("+91")) {
      setError("Phone must start with +91");
      return;
    }

    setError("");
    setOtpLoading(true);

    try {
      setupRecaptcha();
      const result = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier
      );

      setConfirmationResult(result);
      alert("OTP sent ✔");

    } catch (err) {
      setError(err.message);
    }
    setOtpLoading(false);
  };

  /* ---------------------------------------
     VERIFY OTP
  --------------------------------------- */
  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const code = otp.join("");
      await confirmationResult.confirm(code);
      alert("Phone login successful 🎉");
      window.location.href = "/";
    } catch (err) {
      setError("Invalid OTP ❌");
    }

    setLoading(false);
  };

  /* ---------------------------------------
     HANDLE OTP INPUTS
  --------------------------------------- */
  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) otpRefs.current[index + 1].focus();
  };

  /* ---------------------------------------
     GOOGLE LOGIN
  --------------------------------------- */
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await signInWithPopup(auth, googleProvider);
      alert("Login successful 🎉");
      window.location.href = "/";
    } catch (err) {
      setError("Google login failed");
    }

    setLoading(false);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login</h2>

        {/* SWITCHER BUTTON */}
        <div className={styles.switcher}>
          <button
            className={method === "password" ? styles.activeBtn : ""}
            onClick={() => setMethod("password")}
          >
            Password
          </button>

          <button
            className={method === "otp" ? styles.activeBtn : ""}
            onClick={() => setMethod("otp")}
          >
            OTP
          </button>
        </div>

        {/* ---------------- PASSWORD LOGIN FORM ---------------- */}
        {method === "password" && (
          <form onSubmit={handlePasswordLogin} className={styles.form}>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password field with toggle */}
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <span
                className={styles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button type="submit" className={styles.loginBtn}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className={styles.forgotText}>Forgot password?</p>
          </form>
        )}

        {/* ---------------- OTP LOGIN FORM ---------------- */}
        {method === "otp" && (
          <form onSubmit={verifyOtp} className={styles.form}>
            {!confirmationResult ? (
              <>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />

                <div id="recaptcha-container"></div>

                <button
                  type="button"
                  onClick={sendOtp}
                  className={styles.loginBtn}
                >
                  {otpLoading ? "Sending..." : "Send OTP"}
                </button>
              </>
            ) : (
              <>
                <div className={styles.otpBoxContainer}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el)}
                      className={styles.otpInput}
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, i)}
                    />
                  ))}
                </div>

                <button type="submit" className={styles.loginBtn}>
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </>
            )}
          </form>
        )}

        {/* GOOGLE LOGIN BUTTON */}
        <button onClick={handleGoogleLogin} className={styles.googleBtn}>
          <FaGoogle /> Continue with Google
        </button>

        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}
