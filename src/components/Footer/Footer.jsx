import styles from "./Footer.module.css";
import Company from "../../assets/logo.png";
import { FaLinkedin, FaXTwitter, FaFacebookF, FaInstagram } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.wrapper}>

        {/* Logo */}
        <div className={styles.footerLogo}>
          <img src={Company} alt="Company Logo" />
          <p className={styles.tagline}>Smart. Fast. Reliable Household Services.</p>
        </div>

        {/* Footer Columns */}
        <div className={styles.columns}>

          <div className={styles.column}>
            <h3>Company</h3>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/products">Services</a></li>
              <li><a href="/">Home</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3>For Customers</h3>
            <ul>
              <li><a href="/policy">Company Policy</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/contact">Support</a></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3>Customer Support</h3>
            <ul>
              <li>Email: <a href="mailto:partners@quickhome.com">partners@quickhome.com</a></li>
              <li>Phone: <a href="tel:+1234567890">+123 456 7890</a></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3>Follow Us</h3>
            <div className={styles.socialIcons}>
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaLinkedin /></a>
              <a href="#"><FaXTwitter /></a>
            </div>
          </div>

        </div>

        {/* Bottom strip */}
        <div className={styles.bottom}>
          <p>© 2025 QuickHome • All Rights Reserved</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
