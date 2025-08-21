import styles from "./Footer.module.css";
import Company from "../../assets/logo.png";
import { FaLinkedin, FaXTwitter, FaFacebookF, FaInstagram } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Logo Section */}
        <div className={styles.logoSection}>
          <img className={styles.Company} src={Company} alt="Company Logo" />
        </div>

        {/* Links Section */}
        <div className={styles.linksContainer}>
          {/* Company Info */}
          <div className={styles.column}>
            <h3>Company</h3>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/products">Services</a></li>
              <li><a href="/">Home</a></li>
              <li><a href="/contact">Contacts</a></li>
            </ul>
          </div>

          {/* Customer Section */}
          <div className={styles.column}>
            <h3>For Customers</h3>
            <ul>
              <li><a href="/categories">Company Policy</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </div>

          {/* Partner Section */}
          <div className={styles.column}>
            <h3>Customer Support</h3>
            <ul>
              <li><strong></strong> <a href="mailto:partners@quickhome.com">partners@quickhome.com</a></li>
              <li><strong>Contact:</strong> <a href="tel:+1234567890">+123 456 7890</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className={styles.column}>
            <h3>Social Links</h3>
            <div className={styles.socialIcons}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaXTwitter /></a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={styles.bottom}>
          <p>&copy; 2025 QuickHome. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
