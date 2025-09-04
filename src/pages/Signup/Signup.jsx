import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";
import { auth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

const Signup = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill("")); // ✅ OTP as array
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupMethod, setSignupMethod] = useState("email");
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  // ✅ Send OTP
  const sendOtp = async () => {
    if (!phone.match(/^[6-9]\d{9}$/)) {
      return alert("Enter a valid 10-digit phone number");
    }

    setLoading(true);

    try {
      // Remove old reCAPTCHA
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }

      // Fresh reCAPTCHA
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => console.log("reCAPTCHA verified ✅"),
        }
      );

      const appVerifier = window.recaptchaVerifier;

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        "+91" + phone,
        appVerifier
      );

      window.confirmationResult = confirmationResult;
      setOtpSent(true);
      setTimer(60);
      setOtp(Array(6).fill("")); // ✅ reset OTP array
      alert("OTP sent ✅ (in dev, use test number/OTP)");
    } catch (error) {
      console.error("OTP Error:", error);
      alert("Failed to send OTP: " + error.message);
    }

    setLoading(false);
  };

  // ✅ Timer countdown
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // ✅ Verify OTP
  const verifyOtp = async () => {
    const code = otp.join(""); // merge into string
    if (code.length !== 6) return alert("Enter 6-digit OTP");

    try {
      await window.confirmationResult.confirm(code);
      alert("Phone Signup successful ✅");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Invalid OTP ❌");
    }
  };

  // ✅ Email Signup
  const onSubmit = async (data) => {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      alert("Account created successfully!");
      navigate("/");
    } catch (err) {
      console.error("Signup error:", err.message);
      alert("Signup error: " + err.message);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupForm}>
        <h2>Create Account</h2>

        {/* Toggle Buttons */}
        <div className={styles.toggleButtons}>
          <button
            type="button"
            className={`${styles.toggleBtn} ${signupMethod === "email" ? styles.active : ""}`}
            onClick={() => setSignupMethod("email")}
          >
            Password
          </button>
          <button
            type="button"
            className={`${styles.toggleBtn} ${signupMethod === "phone" ? styles.active : ""}`}
            onClick={() => setSignupMethod("phone")}
          >
            OTP
          </button>
        </div>

        {/* Email Signup */}
        {signupMethod === "email" && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                type="text"
                placeholder="John Doe"
              />
              {errors.name && <span className={styles.error}>{errors.name.message}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label>Email</label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: "Enter a valid email" }
                })}
                type="email"
                placeholder="example@email.com"
              />
              {errors.email && <span className={styles.error}>{errors.email.message}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label>Password</label>
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters required" }
                })}
                type="password"
                placeholder="Enter password"
              />
              {errors.password && <span className={styles.error}>{errors.password.message}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label>Confirm Password</label>
              <input
                {...register("confirmPassword", {
                  required: "Please confirm password",
                  validate: (val) =>
                    val === watch("password") || "Passwords do not match"
                })}
                type="password"
                placeholder="Confirm password"
              />
              {errors.confirmPassword && (
                <span className={styles.error}>{errors.confirmPassword.message}</span>
              )}
            </div>

            <button type="submit" className={styles.submitBtn}>
              Sign Up with Email
            </button>
          </form>
        )}

        {/* Phone Signup */}
        {signupMethod === "phone" && (
          <div>
            <div className={styles.inputGroup}>
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {!otpSent ? (
              <button
                type="button"
                onClick={sendOtp}
                disabled={loading}
                className={styles.submitBtn}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            ) : (
              <>
                {/* OTP Input Boxes */}
                <div className={styles.inputGroup}>
                  <label>Enter OTP</label>
                  <div className={styles.otpContainer}>
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        className={styles.otpInput}
                        value={digit}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, ""); // only digits
                          const newOtp = [...otp];
                          newOtp[index] = val;
                          setOtp(newOtp);

                          if (val && e.target.nextSibling) {
                            e.target.nextSibling.focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" && !otp[index] && e.target.previousSibling) {
                            e.target.previousSibling.focus();
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>

                <button type="button" onClick={verifyOtp} className={styles.submitBtn}>
                  Verify OTP & Signup
                </button>

                {/* Resend OTP */}
                {timer > 0 ? (
                  <p style={{ textAlign: "center", marginTop: "10px" }}>
                    Resend OTP in <b>{timer}</b>s
                  </p>
                ) : (
                  <button type="button" onClick={sendOtp} className={styles.resendBtn}>
                    Resend OTP
                  </button>
                )}
              </>
            )}
          </div>
        )}

        <p className={styles.signinLink}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>

      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Signup;
