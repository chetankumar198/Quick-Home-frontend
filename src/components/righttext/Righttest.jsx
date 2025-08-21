import { useRef, useState } from "react";
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
    { id: 5, name: "Hire Cook", image: Chef, path: "cook" }
];

const Righttest = () => {
    const scrollRef = useRef(null);
    const { addToCart } = useCart();
    const [selectedService, setSelectedService] = useState(null);
    const [selectedGender, setSelectedGender] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft -= 320;
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft += 320;
        }
    };

    const handleBookNow = (servicePath) => {
        setSelectedService(servicePath);
        setSelectedGender(null);
        setQuantity(1);
    };

    const handleGenderSelection = (gender) => {
        setSelectedGender(gender);
    };

    const handleAddToCart = () => {
        addToCart({ service: selectedService, gender: selectedGender, duration: "55 min", quantity });
        setSelectedService(null);
        setQuantity(1);
    };

    return (
        <section className={styles.Righttest}>
            <h1 className={styles.servicetitle}>
                QuickHome - Choose Your Service, Get Help Instantly!⚡
            </h1>

            <div className={styles.scrollContainer}>
                <button className={styles.scrollButton} onClick={scrollLeft}>
                    <FaChevronLeft />
                </button>

                <div className={styles.servicesWrapper}>
                    <div className={styles.servicesContainer} ref={scrollRef}>
                        {services.map((service) => (
                            <div key={service.id} className={styles.serviceBox}>
                                <img src={service.image} alt={service.name} />
                                <p>{service.name}</p>
                                <p className={styles.priceText}>Price: ₹{servicePrices[service.path]}</p>

                                <button 
                                    className={styles.serviceButton} 
                                    onClick={() => handleBookNow(service.path)}
                                >
                                    Book Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <button className={styles.scrollButton} onClick={scrollRight}>
                    <FaChevronRight />
                </button>
            </div>

            {selectedService && (
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
                            <button className={styles.addToCartButton} onClick={handleAddToCart}>
                                Add to Cart
                            </button>
                        </>
                    )}
                    <button className={styles.closeButton} onClick={() => setSelectedService(null)}>Close</button>
                </div>
            )}
        </section>
    );
};

export default Righttest;
