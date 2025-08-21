import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Signup.module.css';
import { auth } from '../../firebase';
import { signInWithCustomToken } from 'firebase/auth';

const Signup = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // Send signup data to your backend
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email || '',
          password: data.password
        })
      });

      const res = await response.json();
      if (res.error) {
        alert("Signup failed: " + res.error);
        return;
      }

      // Login using custom token
      await signInWithCustomToken(auth, res.token);
      alert("Account created and logged in successfully!");
      navigate('/');

    } catch (err) {
      console.error("Signup error:", err.message);
      alert("Signup error: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.signupContainer}>
      <div className={styles.signupForm}>
        <h2>Create Account</h2>

        <div className={styles.inputGroup}>
          <label>Full Name</label>
          <input {...register("name", { required: "Name is required" })} type="text" placeholder="John Doe" />
          {errors.name && <span className={styles.error}>{errors.name.message}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label>Phone Number</label>
          <input
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[6-9]\d{9}$/,
                message: "Enter a valid Indian phone number"
              }
            })}
            type="tel"
            placeholder="+91 9876543210"
          />
          {errors.phone && <span className={styles.error}>{errors.phone.message}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label>Email (optional)</label>
          <input
            {...register("email", {
              pattern: {
                value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                message: "Enter a valid email"
              }
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
              minLength: {
                value: 6,
                message: "Minimum 6 characters required"
              }
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
          {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword.message}</span>}
        </div>

        <button type="submit" className={styles.submitBtn}>Sign Up</button>

        <p className={styles.signinLink}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </form>
  );
};

export default Signup;
