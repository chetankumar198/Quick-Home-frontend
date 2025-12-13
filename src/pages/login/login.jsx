import React, { useState, useRef } from "react";
import { auth, googleProvider } from "../../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  RecaptchaVerifier,
} from "firebase/auth";

import styles from "./login.module.css";
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

  /* ===============================
     PASSWORD LOGIN
  =============================== */
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "/";
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  /* ===============================
     SETUP RECAPTCHA (CORRECT)
  =============================== */
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );
    }
  };

  /* ===============================
     SEND OTP
  =============================== */
  const sendOtp = async () => {
    if (!phone.startsWith("+91")) {
      setError("Phone number must start with +91");
      return;
    }

    setError("");
    setOtpLoading(true);

    try {
      setupRecaptcha();

      const appVerifier = window.recaptchaVerifier;

      const result = await signInWithPhoneNumber(
        auth,
        phone,
        appVerifier
      );

      setConfirmationResult(result);
      alert("OTP sent successfully ✅");
    } catch (err) {
      setError(err.message);
    }

    setOtpLoading(false);
  };

  /* ===============================
     VERIFY OTP
  =============================== */
  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const code = otp.join("");
      await confirmationResult.confirm(code);
      window.location.href = "/";
    } catch (err) {
      setError("Invalid OTP ❌");
    }

    setLoading(false);
  };

  /* ===============================
     OTP INPUT HANDLER
  =============================== */
  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  /* ===============================
     GOOGLE LOGIN
  =============================== */
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await signInWithPopup(auth, googleProvider);
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

        {/* SWITCH */}
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

        {/* PASSWORD LOGIN */}
        {method === "password" && (
          <form onSubmit={handlePasswordLogin} className={styles.form}>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

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

            <button className={styles.loginBtn}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        {/* OTP LOGIN */}
        {method === "otp" && (
          <form onSubmit={verifyOtp} className={styles.form}>
            {!confirmationResult ? (
              <>
                <input
                  type="tel"
                  placeholder="+91XXXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />

                {/* REQUIRED */}
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
                      onChange={(e) =>
                        handleOtpChange(e.target.value, i)
                      }
                    />
                  ))}
                </div>

                <button className={styles.loginBtn}>
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </>
            )}
          </form>
        )}

        {/* GOOGLE LOGIN */}
        <button onClick={handleGoogleLogin} className={styles.googleBtn}>
          <FaGoogle /> Continue with Google
        </button>

        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}
