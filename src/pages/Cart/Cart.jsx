import React from "react";
import { useCart } from "../../components/context/CartContext";
import styles from "./Cart.module.css";
import { useNavigate } from "react-router-dom";

// Import all service images
import Chef from "../../assets/chef.webp";
import Maid from "../../assets/maid.webp";
import Helper from "../../assets/helper.webp";
import Driver from "../../assets/driver.webp";
import Iron from "../../assets/iron.webp";
import Cleaning from "../../assets/service1.webp"; // Ensure this exists

// Map service names to images
const serviceImages = { 
    maid: Maid, 
    laundry: Iron, 
    helper: Helper, 
    driver: Driver, 
    cook: Chef,
    cleaning: Cleaning  // Added 'cleaning' key
};

// Map service names to prices
const servicePrices = { 
    maid: 50, 
    laundry: 30, 
    helper: 40, 
    driver: 60, 
    cook: 70,
    cleaning: 45 // Added 'cleaning' price
};

const Cart = () => {
    const navigate = useNavigate();
    const { cart, removeFromCart } = useCart();
    const totalPrice = cart.reduce((total, item) => 
        total + (servicePrices[item.service] || 0) * item.quantity, 0);

    return (
        <div className={styles.cartContainer}>
            <h2 className={styles.cartTitle}>Your Cart</h2>
            {cart.length === 0 ? (
                <p className={styles.emptyCart}>Your cart is empty.</p>
            ) : (
                <div className={styles.cartItems}>
                    {cart.map((item, index) => (
                        <div key={index} className={styles.cartItem}>
                            {/* Fix: Ensure image path exists, use fallback if not found */}
                            <img 
                                src={serviceImages[item.service] || Cleaning} 
                                alt={item.service} 
                                className={styles.itemImage} 
                            />
                            <div className={styles.itemDetails}>
                                <h3>{item.service.charAt(0).toUpperCase() + item.service.slice(1)}</h3>
                                <p><strong>Gender:</strong> {item.gender}</p>
                                <p><strong>Duration:</strong> {item.duration}</p>
                                <p><strong>Quantity:</strong> {item.quantity}</p>
                                <p><strong>Price:</strong> ₹{servicePrices[item.service] * item.quantity || 0}</p>
                            </div>
                            <button className={styles.removeButton} onClick={() => removeFromCart(index)}>
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {cart.length > 0 && (
                <div className={styles.cartSummary}>
                    <h3>Total Items: {cart.reduce((total, item) => total + item.quantity, 0)}</h3>
                    <h3>Total Price: ₹{totalPrice}</h3>
                    <button className={styles.checkoutButton} onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </button>
                </div>
            )}
        </div>
    );
};

export default Cart;
