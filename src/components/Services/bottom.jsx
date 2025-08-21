import styles from './bottom.module.css'; 

const Bottom = () => {
  return (
    <>
      <section className={styles.detail}>
        <div className={styles.container}>
          <div className={styles.box}>Why us?</div>
          <div className={styles.whyUsContainer}>
            <div className={styles.whyUsBox}>
              <h3>Immediate Support</h3>
              <p>We understand urgency! Our experts arrive within 30 minutes to assist you with household tasks.</p>
            </div>
            <div className={styles.whyUsBox}>
              <h3>Convenient Booking</h3>
              <p>"QuickHome" fast and user-friendly platform lets you book trusted household services in just a few taps.</p>
            </div>
            <div className={styles.whyUsBox}>
              <h3>Reliable Providers</h3>
              <p>"QuickHome" brings you trusted professionals, carefully checked to ensure reliable, high-quality service for your peace of mind.</p>
            </div>
            <div className={styles.whyUsBox}>
              <h3>Customer Support</h3>
              <p>Need help? Our support team is available to assist you. Contact us.</p>
              <p className={styles.contact}>📞 6203096351</p>
            </div>
          </div>
        </div>

        {/* Get in Touch Form */}
        <div className={styles.contactContainer}>
          <h2>Register as a professional </h2>
          <form className={styles.contactForm}>
            <div className={styles.inputGroup}>
              <input type="text" placeholder="First Name" required className={styles.inputField} />
              <input type="text" placeholder="Last Name" required className={styles.inputField} />
            </div>
            <div className={styles.inputGroup}>
              <input type="text" placeholder="Phone" required className={styles.inputField} />
              <input type="text" placeholder="Service" required className={styles.inputField} />
            </div>
            <input type="text" placeholder="Address" required className={styles.inputField} />
            <textarea placeholder="About" rows="4" required className={styles.textArea}></textarea>
            <p className={styles.privacyText}>
              By submitting this form, you agree that we may use the data you provide to contact you with information related to your request/submission. Your data will be used subject to QuickHome's <a href="#">Privacy Policy</a>.
            </p>
            <button type="submit" className={styles.submitBtn}>Submit</button>
          </form>

          <div className={styles.partner}>
            <h1>Join QuickHome to open new opportunities</h1>
            <p>QuickHome is an app-based platform that helps professionals like you take charge of your career and work independently.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Bottom;
