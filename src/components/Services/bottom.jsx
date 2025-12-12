import styles from "./bottom.module.css";

const Bottom = () => {
  return (
    <section className={styles.bottomSection}>
      
      {/* WHY US SECTION */}
      <div className={styles.whyContainer}>
        <h2 className={styles.sectionTitle}>Why Choose <span>QuickHome?</span></h2>

        <div className={styles.whyGrid}>
          {[
            {
              title: "Immediate Support",
              text: "Our experts arrive within 30 minutes to assist you with household tasks.",
            },
            {
              title: "Convenient Booking",
              text: "Book trusted household services in just a few taps through our seamless platform.",
            },
            {
              title: "Reliable Providers",
              text: "Professionals are identity-verified and experienced, ensuring top-quality service.",
            },
            {
              title: "Customer Support",
              text: "Need help? Our dedicated support team is here for you anytime.",
              contact: "📞 6203096051",
            },
          ].map((item, index) => (
            <div key={index} className={styles.whyCard}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              {item.contact && <p className={styles.contact}>{item.contact}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* PROFESSIONAL REGISTRATION FORM */}
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Register as a Professional</h2>

        <form className={styles.contactForm}>
          <div className={styles.row}>
            <input type="text" placeholder="First Name" required />
            <input type="text" placeholder="Last Name" required />
          </div>

          <div className={styles.row}>
            <input type="text" placeholder="Phone Number" required />
            <input type="text" placeholder="Service You Provide" required />
          </div>

          <input type="text" placeholder="Full Address" required />

          <textarea placeholder="Describe your experience" rows="4"></textarea>

          <p className={styles.privacyText}>
            By submitting this form, you agree that QuickHome may use your data 
            to contact you regarding your application. Read our{" "}
            <a href="#">Privacy Policy</a>.
          </p>

          <button type="submit" className={styles.submitBtn}>Submit</button>
        </form>

        <div className={styles.partnerBanner}>
          <h1>Grow Your Career with QuickHome</h1>
          <p>Join thousands of professionals who earn independently through our platform.</p>
        </div>
      </div>
    </section>
  );
};

export default Bottom;
