import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../components/context/CartContext";
import styles from "./image.module.css";
import maid1 from "../../assets/maid2.jpg";
import maid2 from "../../assets/maid3.jpg";
import driver from "../../assets/driver.jpg";
import helper from "../../assets/helper.jpg";
import Sidelogo from "../../assets/sidelogo.png";
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
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [selectedService, setSelectedService] = useState(null);
    const [selectedGender, setSelectedGender] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const handleServiceClick = (service) => {
        setSelectedService(service);
        setSelectedGender(null);
        setQuantity(1);
    };

    const handleGenderSelection = (gender) => {
        setSelectedGender(gender);
    };

    const handleAddToCart = () => {
        addToCart({ service: selectedService, gender: selectedGender, duration: "55 min", quantity });
        setSelectedService(null);
    };

    return (
        <div className={styles.container}>
            {/* Service Image Grid */}
            <div className={styles.imageGrid}>
                <div>
                    <img src={maid2} alt="Expert Chef Service" className={styles.image1} loading="lazy" />
                </div>
                <div>
                    <img src={maid1} alt="Professional Maid Service" className={styles.image2} loading="lazy" />
                </div>
                <div>
                    <img src={driver} alt="Reliable Driver Service" className={styles.image3} loading="lazy" />
                </div>
                <img src={helper} alt="Skilled Cleaner Service" className={styles.image4} loading="lazy" />
            </div>

            {/* Text Section */}
            <div className={styles.textSection}>
                <h1 className={styles.toptext}>Get your service within</h1>
                <h2 className={styles.highlight}>30 minutes at your doorstep</h2>

                <div className={styles.additionalTextbox}>
                    <h3>Popular Category</h3>
                    <div className={styles.midText}>
                        <h1>Get Your First Service Free..</h1>
                    </div>
                    {/* Updated Promotional Section */}
                <div className={styles.promoContainer}>
                   
                    <p className={styles.promoText}>
                        As a welcome gift, enjoy your first service free of charge! Whether you need a professional cleaner, an experienced cook, or any other household help, we've got you covered.
                    </p>
                    
                </div>
                    
                    <div className={styles.serviceIcons}>
                        <div className={styles.serviceIcon} onClick={() => handleServiceClick("cleaning")}>
                            <img src={service1} alt="Cleaning Service" style={{ cursor: "pointer" }} />
                            <p>Cleaning</p>
                        </div>
                        <div className={styles.serviceIcon} onClick={() => handleServiceClick("cook")}>
                            <img src={service2} alt="Hire Cook" style={{ cursor: "pointer" }} />
                            <p>Hire Cook</p>
                        </div>
                    </div>
                </div>
                <div className={styles.sidelogo}>
                    <img src={Sidelogo} alt="Instant Service Logo" loading="lazy" />
                </div>
            </div>

            {/* Modal for Selecting Gender */}
            {selectedService && (
                <div className={styles.modalOverlay}>
                    <div className={styles.boxContainer}>
                        {!selectedGender ? (
                            <>
                                <h2 className={styles.modalTitle}>Select Preferred Gender</h2>
                                <div className={styles.modalOptions}>
                                    <div className={styles.modalOption} onClick={() => handleGenderSelection("male")}>
                                        <img src={MaleIcon} alt="Male" />
                                        <p>Male</p>
                                    </div>
                                    <div className={styles.modalOption} onClick={() => handleGenderSelection("female")}>
                                        <img src={FemaleIcon} alt="Female" />
                                        <p>Female</p>
                                    </div>
                                    <div className={styles.modalOption} onClick={() => handleGenderSelection("any")}>
                                        <img src={AnyIcon} alt="Any" />
                                        <p>Any</p>
                                    </div>
                                </div>

                                {/* Close Button Centered Below */}
                                <div className={styles.modalButtons}>
                                    <button className={styles.closeButton} onClick={() => setSelectedService(null)}>Close</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className={styles.modalTitle}>Confirm Your Booking</h2>
                                <div className={styles.details}>
                                    <p><strong>Service:</strong> {selectedService}</p>
                                    <p><strong>Preferred Gender:</strong> {selectedGender}</p>
                                    <p><strong>Duration:</strong> 55 min</p>
                                    <p><strong>Price:</strong> ₹{servicePrices[selectedService] * quantity}</p>
                                </div>
                                <div className={styles.quantityContainer}>
                                    <button className={styles.quantityBtn} onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                    <span className={styles.quantityValue}>{quantity}</span>
                                    <button className={styles.quantityBtn} onClick={() => setQuantity(quantity + 1)}>+</button>
                                </div>
                                <div className={styles.modalButtons}>
                                    <button className={styles.addToCartButton} onClick={handleAddToCart}>Add to Cart</button>
                                    <button className={styles.closeButton} onClick={() => setSelectedService(null)}>Close</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Image;
