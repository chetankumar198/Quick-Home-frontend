import { useState, useEffect } from 'react';
import styles from './Login.module.css';
import { auth } from '../../firebase';
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signInWithCustomToken,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [useOtp, setUseOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    otp: ['', '', '', '', '', ''],
  });

  const navigate = useNavigate();

  // Countdown for resend OTP
  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOtpChange = (index, value) => {
    const newOtp = [...formData.otp];
    newOtp[index] = value.slice(0, 1);
    setFormData({ ...formData, otp: newOtp });

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(
          'recaptcha-container',
          {
            size: 'invisible',
            callback: (response) => {
              console.log('reCAPTCHA solved:', response);
              handleSendOtp();
            },
            'expired-callback': () => {
              alert('reCAPTCHA expired. Please refresh.');
            },
          },
          auth
        );
        window.recaptchaVerifier.render().then((widgetId) => {
          window.recaptchaWidgetId = widgetId;
        });
      } catch (err) {
        console.error('reCAPTCHA init error:', err);
        alert('reCAPTCHA not ready. Please wait a moment.');
      }
    }
  };

  const handleSendOtp = async () => {
    const phoneNumber = '+91' + formData.phone;
    if (!formData.phone.match(/^[6-9]\d{9}$/)) {
      alert('Enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      window.confirmationResult = confirmationResult;
      setOtpSent(true);
      setTimer(30);
      alert('OTP sent!');
    } catch (err) {
      console.error('Error sending OTP:', err);
      alert('Failed to send OTP: ' + err.message);
    }
    setLoading(false);
  };

  const handlePasswordLogin = async () => {
    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }
      await signInWithCustomToken(auth, data.token);
      alert('Logged in!');
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (useOtp) {
      const otp = formData.otp.join('');
      if (otp.length !== 6) {
        alert('Enter the full 6-digit OTP.');
        return;
      }
      try {
        const result = await window.confirmationResult.confirm(otp);
        console.log('OTP login success:', result.user);
        alert('Logged in with OTP!');
        navigate('/');
      } catch (err) {
        alert('Invalid OTP. Try again.');
      }
    } else {
      await handlePasswordLogin();
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h2>{useOtp ? 'Login with OTP' : 'Welcome Back'}</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              required
            />
          </div>

          {!useOtp ? (
            <>
              <div className={styles.inputGroup}>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>
              <button type="submit" className={styles.loginBtn}>
                Log In
              </button>
            </>
          ) : !otpSent ? (
            <button
              type="button"
              className={styles.loginBtn}
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? 'Loading reCAPTCHA...' : 'Send OTP'}
            </button>
          ) : (
            <>
              <div className={styles.otpBoxGroup}>
                {formData.otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    className={styles.otpInput}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                  />
                ))}
              </div>

              <div className={styles.resendOtp}>
                {timer > 0 ? (
                  <span>
                    Resend OTP in <strong>{timer}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className={styles.resendBtn}
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button type="submit" className={styles.loginBtn}>
                Verify OTP
              </button>
            </>
          )}
        </form>

        <div className={styles.toggleOtp}>
          <span>
            {useOtp ? 'Remembered password?' : 'Forgot password?'}
          </span>
          <button
            onClick={() => {
              setUseOtp(!useOtp);
              setOtpSent(false);
              setTimer(0);
              setFormData({ ...formData, otp: ['', '', '', '', '', ''] });
            }}
          >
            {useOtp ? 'Login with Password' : 'Login with OTP'}
          </button>
        </div>

        <p className={styles.signupLink}>
          New here? <a href="/signup">Create an account</a>
        </p>
      </div>

      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Login;
