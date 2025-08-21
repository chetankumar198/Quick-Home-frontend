import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "./About.module.css"; // Import CSS
import { FaClock, FaUserCheck, FaStar, FaHeadset } from "react-icons/fa";
import aboutImage from "../../assets/maid3.jpg"; // Hero Image
import teamImage from "../../assets/maid2.jpg"; // Team Image

const About = () => {

    const navigate = useNavigate(); // Initialize navigation

    return (
      <div className={styles.aboutPage}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroText}>
            <h1>
              Get Your Service Instantly in{" "}
              <span className={styles.animatedText}>30 Minutes!</span>
            </h1>
            <p>QuickHome ensures fast, reliable, and professional home services at your doorstep.</p>
          </div>
          <img src={aboutImage} alt="About QuickHome" className={styles.heroImage} />
        </section>

         {/* Who We Are */}
      <section className={styles.whoWeAre}>
        <h2>Who We Are</h2>
        <p>
          At QuickHome, we connect you with background-verified home service professionals for a 
          seamless and stress-free experience. Whether you need a maid, driver, or cook, we bring 
          expert services to your doorstep in just a few clicks.
        </p>
      </section>
  
        {/* Why QuickHome? */}
        <section className={styles.whyQuickHome}>
          <h2>Why Choose QuickHome?</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <FaClock className={styles.icon} />
              <h3>Fast & Instant Service</h3>
              <p>Book any service and get help within **30 minutes**!</p>
            </div>
            <div className={styles.featureCard}>
              <FaUserCheck className={styles.icon} />
              <h3>Trusted Professionals</h3>
              <p>All service providers are background-verified for your safety.</p>
            </div>
            <div className={styles.featureCard}>
              <FaStar className={styles.icon} />
              <h3>High-Quality Work</h3>
              <p>Trained professionals ensure top-notch home services.</p>
            </div>
            <div className={styles.featureCard}>
              <FaHeadset className={styles.icon} />
              <h3>24/7 Customer Support</h3>
              <p>Need help? Our support team is available round the clock.</p>
            </div>
          </div>
        </section>
  
        {/* Meet the Team */}
        <section className={styles.teamSection}>
          <h2>Meet Our Experts</h2>
          <img src={teamImage} alt="Our Team" className={styles.teamImage} />
          <p>We are a passionate team dedicated to providing fast and trusted home services.</p>
        </section>
  
        {/* Call to Action */}
        <section className={styles.callToAction}>
          <h2>Need Instant Help? Get Started Now!</h2>
          <p>Book your service today and experience **instant assistance**.</p>
          {/* Updated Book Now button to navigate to Products page */}
        <button className={styles.ctaButton} onClick={() => navigate("/products")}>
            Book Now
            </button>
        </section>
      </div>
    );
  };
  
  export default About;