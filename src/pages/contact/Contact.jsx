import React, { useState } from 'react'; 
import styles from './Contact.module.css'; 

const Contact = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Form submitted successfully!');
    };

    return (
        <div className={styles.contactContainer}>
            <div className={styles.contactBox}>
                <h1>Contact Us</h1>
                <p>Have questions? Fill out the form below and we’ll get back to you soon.</p>
                <form onSubmit={handleSubmit} className={styles.contactForm}>
                    <input type="text" name="fullName" placeholder="Enter full name" value={formData.fullName} onChange={handleChange} required className={styles.input} />
                    <input type="email" name="email" placeholder="Enter your email address" value={formData.email} onChange={handleChange} required className={styles.input} />
                    <input type="tel" name="phone" placeholder="Enter phone number" value={formData.phone} onChange={handleChange} required className={styles.input} />
                    <textarea name="message" placeholder="Enter your message" value={formData.message} onChange={handleChange} required className={styles.textarea}></textarea>
                    <button type="submit" className={styles.submitButton}>Submit</button>
                </form>
           
            <div className={styles.helpSection}>
                <h3>Need Help?</h3>
                <p>For quick assistance, visit our Help Center.</p>
                {/* <a href="/help" className={styles.helpLink}>Open Help Center →</a> */}
                <h3>Still facing issues?</h3>
                <p>Email us at <a href="mailto:support@quickhome.com" className={styles.emailLink}>support@quickhome.com</a> and we’ll respond within 24-48 hours.</p>
            </div>
        </div>
        </div>
    );
};

export default Contact;
