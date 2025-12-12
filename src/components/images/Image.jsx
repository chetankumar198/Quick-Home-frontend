import { useState } from "react";
import { useCart } from "../../components/context/CartContext";
import styles from "./image.module.css";

import maid1 from "../../assets/maid2.jpg";
import maid2 from "../../assets/maid3.jpg";
import driver from "../../assets/driver.jpg";
import helper from "../../assets/helper.jpg";

import service1 from "../../assets/service1.webp";
import service2 from "../../assets/chef.webp";

import MaleIcon from "../../assets/man.webp";
import FemaleIcon from "../../assets/women.webp";
import AnyIcon from "../../assets/man and women.webp";

const servicePrices = {
  cleaning: 45,
  cook: 70,
};

const Image = () => {
  const { addToCart } = useCart();

  const [selectedService, setSelectedService] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [quantity, setQuantity] = useState(1);

  return (
    <section className={styles.heroSection}>

      {/* LEFT — IMAGE GRID */}
      <div className={styles.leftGrid}>
        {[maid2, maid1, driver, helper].map((img, i) => (
          <div key={i} className={styles.gridItem}>
            <img src={img} alt="service" loading="lazy" />
          </div>
        ))}
      </div>

      {/* RIGHT — TEXT AREA */}
      <div className={styles.rightContent}>
        <p className={styles.subtitle}>Get your service within</p>

        <h1 className={styles.heading}>
          <span className={styles.timePulse}>30 minutes</span> at your doorstep
        </h1>

        {/* Glass Card */}
        <div className={styles.infoCard}>

          <h3 className={styles.sectionLabel}>Popular Category</h3>

          <h2 className={styles.freeText}>
            Get Your First Service Free 🎁
          </h2>

          <p className={styles.description}>
            As a welcome gift, enjoy your first service free of charge.
            Whether you need a professional cleaner, an experienced cook,
            or reliable help — we’ve got you covered.
          </p>

          {/* Modern service bubbles */}
          <div className={styles.serviceRow}>

            <div
              className={styles.serviceCard}
              onClick={() => setSelectedService("cleaning")}
            >
              <div className={styles.serviceCircle}>
                <img src={service1} alt="Cleaning" />
              </div>
              <p>Cleaning</p>
            </div>

            <div
              className={styles.serviceCard}
              onClick={() => setSelectedService("cook")}
            >
              <div className={styles.serviceCircle}>
                <img src={service2} alt="Hire Cook" />
              </div>
              <p>Hire Cook</p>
            </div>

          </div>
        </div>
      </div>

      {/* MODAL */}
      {selectedService && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>

            {!selectedGender ? (
              <>
                <h2>Select Preferred Gender</h2>

                <div className={styles.genderOptions}>
                  {[ 
                    { icon: MaleIcon, label: "male" },
                    { icon: FemaleIcon, label: "female" },
                    { icon: AnyIcon, label: "any" }
                  ].map((g) => (
                    <div
                      key={g.label}
                      className={styles.genderOption}
                      onClick={() => setSelectedGender(g.label)}
                    >
                      <img src={g.icon} alt={g.label} />
                      <p>{g.label}</p>
                    </div>
                  ))}
                </div>

                <button 
                  className={styles.closeBtn} 
                  onClick={() => setSelectedService(null)}
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <h2>Confirm Booking</h2>

                <p>Service: {selectedService}</p>
                <p>Gender: {selectedGender}</p>
                <p>Price: ₹{servicePrices[selectedService] * quantity}</p>

                <div className={styles.qtyRow}>
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>

                  <span>{quantity}</span>

                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>

                <button
                  className={styles.addBtn}
                  onClick={() => {
                    addToCart({
                      service: selectedService,
                      gender: selectedGender,
                      quantity,
                      duration: "55 min",
                    });
                    setSelectedService(null);
                    setSelectedGender(null);
                    setQuantity(1);
                  }}
                >
                  Add to Cart
                </button>

                <button
                  className={styles.closeBtn}
                  onClick={() => {
                    setSelectedService(null);
                    setSelectedGender(null);
                  }}
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </section>
  );
};

export default Image;
