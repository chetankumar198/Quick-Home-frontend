import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ServiceDetail.module.css";

// Import images
import Maid from "../../assets/maid.webp";
import Iron from "../../assets/iron.webp";
import Helper from "../../assets/helper.webp";
import Driver from "../../assets/driver.webp";
import Chef from "../../assets/chef.webp";

const serviceDetails = {
    maid: {
        name: "Hire Maid",
        description: "Professional maid services for daily cleaning, mopping, and household chores.",
        price: "₹200 – ₹400 / hour",
        image: Maid,
    },
    laundry: {
        name: "Laundry & Ironing",
        description: "Get your clothes washed, dried and ironed with professional care.",
        price: "₹50 – ₹100 / kg",
        image: Iron,
    },
    helper: {
        name: "Hire Helper",
        description: "Trained household helpers for cleaning, event help, and daily tasks.",
        price: "₹150 – ₹300 / hour",
        image: Helper,
    },
    driver: {
        name: "Hire Driver",
        description: "Experienced drivers available for personal and commercial needs.",
        price: "₹300 – ₹600 / hour",
        image: Driver,
    },
    cook: {
        name: "Hire Cook",
        description: "Expert cooks to prepare healthy & tasty meals at your home.",
        price: "₹250 – ₹500 / hour",
        image: Chef,
    },
};

const ServiceDetail = () => {
    const { serviceName } = useParams();
    const navigate = useNavigate();
    const service = serviceDetails[serviceName];

    if (!service) {
        return <h1 className={styles.notFound}>Service Not Found</h1>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>

                <img src={service.image} alt={service.name} className={styles.image} />

                <div className={styles.info}>
                    <h1 className={styles.title}>{service.name}</h1>
                    <p className={styles.description}>{service.description}</p>
                    <p className={styles.price}>💰 {service.price}</p>

                    <button className={styles.bookBtn} onClick={() => navigate("/products")}>
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetail;
