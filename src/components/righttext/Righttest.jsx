import { useRef, useState, useEffect } from "react";
import { useCart } from "../../components/context/CartContext";
import styles from "./Righttext.module.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import Chef from "../../assets/chef.webp";
import Maid from "../../assets/maid.webp";
import Helper from "../../assets/helper.webp";
import Driver from "../../assets/driver.webp";
import Iron from "../../assets/iron.webp";

import MaleIcon from "../../assets/man.webp";
import FemaleIcon from "../../assets/women.webp";
import AnyIcon from "../../assets/man and women.webp";

const servicePrices = {
  maid: 50,
  laundry: 30,
  helper: 40,
  driver: 60,
  cook: 70,
};

const services = [
  { id: 1, name: "Hire Maid", image: Maid, path: "maid" },
  { id: 2, name: "Laundry & Ironing", image: Iron, path: "laundry" },
  { id: 3, name: "Hire Helper", image: Helper, path: "helper" },
  { id: 4, name: "Hire Driver", image: Driver, path: "driver" },
  { id: 5, name: "Hire Cook", image: Chef, path: "cook" },
];

const Righttest = () => {
  const scrollRef = useRef(null);
  const { addToCart } = useCart();

  const [selectedService, setSelectedService] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });

  const startBooking = (servicePath) => {
    setSelectedService(servicePath);
    setSelectedGender(null);
    setQuantity(1);
    setShowModal(true);
  };

  const handleAddToCart = () => {
    addToCart({
      service: selectedService,
      gender: selectedGender,
      duration: "55 min",
      quantity,
    });
    setShowModal(false);
  };

  return (
    <section className={styles.section}>
      <h1 className={styles.title}>Find Services You Can Trust — Anytime, Instantly ⚡</h1>

      {/* Scrollable Service Cards */}
      <div className={styles.scrollRow}>
        <button onClick={scrollLeft} className={styles.arrowBtn}><FaChevronLeft /></button>

        <div className={styles.cardsWrapper} ref={scrollRef}>
          {services.map((service) => (
            <div key={service.id} className={styles.card}>
              <img src={service.image} alt={service.name} className={styles.cardImg} />

              <div className={styles.cardBody}>
                <p className={styles.cardName}>{service.name}</p>
                <p className={styles.cardPrice}>₹{servicePrices[service.path]}</p>

                <button
                  className={styles.bookBtn}
                  onClick={() => startBooking(service.path)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <button onClick={scrollRight} className={styles.arrowBtn}><FaChevronRight /></button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowModal(false)}>
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            {!selectedGender ? (
              <>
                <h2 className={styles.modalTitle}>Select Preferred Gender</h2>

                <div className={styles.genderRow}>
                  <div className={styles.genderCard} onClick={() => setSelectedGender("male")}>
                    <img src={MaleIcon} alt="Male" />
                    <p>Male</p>
                  </div>
                  <div className={styles.genderCard} onClick={() => setSelectedGender("female")}>
                    <img src={FemaleIcon} alt="Female" />
                    <p>Female</p>
                  </div>
                  <div className={styles.genderCard} onClick={() => setSelectedGender("any")}>
                    <img src={AnyIcon} alt="Any" />
                    <p>Any</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className={styles.modalTitle}>Confirm Your Booking</h2>

                <div className={styles.summaryBox}>
                  <p><strong>Service:</strong> {selectedService}</p>
                  <p><strong>Gender:</strong> {selectedGender}</p>
                  <p><strong>Duration:</strong> 55 min</p>
                  <p><strong>Total:</strong> ₹{servicePrices[selectedService] * quantity}</p>
                </div>

                <div className={styles.qtyRow}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>

                <button className={styles.addCartBtn} onClick={handleAddToCart}>
                  Add to Cart
                </button>
              </>
            )}

            <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Righttest;
