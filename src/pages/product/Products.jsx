import React, { useState , useEffect } from "react";
import { useCart } from "../../components/context/CartContext";
import { useParams } from "react-router-dom";
import styles from "./product.module.css";
import Maid from "../../assets/maid.webp";
import Iron from "../../assets/iron.webp";
import Helper from "../../assets/helper.webp";
import Driver from "../../assets/driver.webp";
import Chef from "../../assets/chef.webp";
import service1 from "../../assets/service1.webp";
import MaleIcon from "../../assets/man.webp";
import FemaleIcon from "../../assets/women.webp";
import AnyIcon from "../../assets/man and women.webp";

const servicePrices = {
    maid: 50,
    laundry: 30,
    helper: 40,
    driver: 60,
    cook: 70,
    cleaning: 70
};

const services = [
    { id: 1, name: "Hire Maid", image: Maid, path: "maid" },
    { id: 2, name: "Hire Cook", image: Chef, path: "cook" },
    { id: 3, name: "Hire Helper", image: Helper, path: "helper" },
    { id: 4, name: "Hire Driver", image: Driver, path: "driver" },
    { id: 5, name: "Laundry & Ironing", image: Iron, path: "laundry" },
    { id: 6, name: "Cleaning", image: service1, path: "cleaning" }
];

const ProductPage = () => {
    
    const { addToCart } = useCart();
    const [selectedService, setSelectedService] = useState(null);
    const [selectedGender, setSelectedGender] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const handleBookNow = (servicePath) => {
        setSelectedService(servicePath);
        setSelectedGender(null);
        setQuantity(1);
    };

    const handleGenderSelection = (gender) => {
        setSelectedGender(gender);
    };

    const handleAddToCart = () => {
        if (!selectedService) {
            console.error("No service selected!");
            return;
        }

        const totalPrice = servicePrices[selectedService] * quantity;

        console.log("Adding to Cart:", {
            service: selectedService,
            gender: selectedGender,
            duration: "55 min",
            quantity,
            price: totalPrice
        });

        addToCart({ 
            service: selectedService, 
            gender: selectedGender, 
            duration: "55 min", 
            quantity, 
            price: totalPrice 
        });

        setSelectedService(null);
    };

    return (
        <div className={styles.productPage}>
            <h1 className={styles.pageTitle}>Our Services</h1>
            <div className={styles.servicesContainer}>
                {services.map((service) => (
                    <div key={service.id} className={styles.serviceCard}>
                        <img src={service.image} alt={service.name} className={styles.serviceImage} />
                        <h2 className={styles.serviceName}>{service.name}</h2>
                        <p className={styles.servicePrice}>Price: ₹{servicePrices[service.path]}</p>
                        <button className={styles.bookNow} onClick={() => handleBookNow(service.path)}>Book Now</button>
                    </div>
                ))}
            </div>

            {selectedService && (
                <div className={styles.modal}>
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
                                <p><strong>Price:</strong> ${servicePrices[selectedService] * quantity}</p>
                            </div>
                            <div className={styles.quantityContainer}>
                                <button className={styles.quantityBtn} onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                <span className={styles.quantityValue}>{quantity}</span>
                                <button className={styles.quantityBtn} onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                            <button className={styles.addToCartButton} onClick={handleAddToCart}>Add to Cart</button>
                        </>
                    )}
                    <button className={styles.closeButton} onClick={() => setSelectedService(null)}>Close</button>
                </div>
            )}
        </div>
    );
};

export default ProductPage;
