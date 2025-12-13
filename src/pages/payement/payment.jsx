import React, { useState } from "react";
import styles from "./payment.module.css";
import { useCart } from "../../components/context/CartContext";
import { FaCashRegister, FaCreditCard } from "react-icons/fa";

import Maid from "../../assets/maid.webp";
import Cook from "../../assets/chef.webp";
import Driver from "../../assets/driver.webp";
import Helper from "../../assets/helper.webp";
import Iron from "../../assets/iron.webp";
import Cleaning from "../../assets/service1.webp";

const serviceImages = {
  maid: Maid,
  cook: Cook,
  driver: Driver,
  helper: Helper,
  laundry: Iron,
  cleaning: Cleaning,
};

const servicePrices = {
  maid: 50,
  laundry: 30,
  helper: 40,
  driver: 60,
  cook: 70,
  cleaning: 45,
};

const Checkout = () => {
  const { cart } = useCart();
  const API = import.meta.env.VITE_BACKEND_URL;

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
    landmark: "",
  });

  const totalPrice = cart.reduce(
    (acc, item) =>
      acc + (servicePrices[item.service] || 0) * item.quantity,
    0
  );

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ===========================
     VALIDATION
  ============================ */
  const validate = () => {
    const err = {};
    if (!form.name) err.name = "Name required";
    if (!form.phone || form.phone.length !== 10)
      err.phone = "Valid phone required";
    if (!form.address) err.address = "Address required";
    if (!form.pincode) err.pincode = "Pincode required";
    if (!form.city) err.city = "City required";
    if (!form.state) err.state = "State required";
    if (cart.length === 0) err.cart = "Cart is empty";
    return err;
  };

  /* ===========================
     PLACE ORDER
  ============================ */
  const handleOrder = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const orderData = {
      ...form,
      services: cart.map((item) => ({
        service: item.service,
        quantity: item.quantity,
        price: servicePrices[item.service] * item.quantity,
      })),
      totalPrice,
      paymentMethod,
    };

    setLoading(true);

    try {
      const res = await fetch(
        `${API}/api/orders/place-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        }
      );

      if (!res.ok) {
        const text = await res.text(); // ⛔ avoid JSON crash
        throw new Error(text || "Order failed");
      }

      const data = await res.json();
      alert("✅ Order placed successfully");
      console.log("Order:", data);

    } catch (err) {
      console.error("Order Error:", err);
      alert("❌ Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.checkoutContainer}>
      <h2>Checkout</h2>

      {/* ================= SERVICE SUMMARY ================= */}
      <div className={styles.section}>
        <h3>Service Summary</h3>

        {cart.map((item, i) => (
          <div key={i} className={styles.itemCard}>
            <img
              src={serviceImages[item.service]}
              alt={item.service}
              className={styles.itemImage}
            />
            <div>
              <h4>{item.service}</h4>
              <p>Gender: {item.gender || "Any"}</p>
              <p>Duration: {item.duration || "-"}</p>
              <p>Quantity: {item.quantity}</p>
              <p>
                Price: ₹
                {(servicePrices[item.service] || 0) * item.quantity}
              </p>
            </div>
          </div>
        ))}

        <p className={styles.totalPrice}>
          <strong>Total:</strong> ₹{totalPrice}
        </p>
      </div>

      {/* ================= DELIVERY DETAILS ================= */}
      <div className={styles.section}>
        <h3>Delivery Details</h3>

        {["name", "phone", "pincode", "city", "state"].map((field) => (
          <div key={field}>
            <input
              name={field}
              placeholder={field.toUpperCase()}
              value={form[field]}
              onChange={handleChange}
              className={styles.input}
            />
            {errors[field] && (
              <p className={styles.error}>{errors[field]}</p>
            )}
          </div>
        ))}

        <textarea
          name="address"
          placeholder="Full Address"
          value={form.address}
          onChange={handleChange}
          className={styles.textarea}
        />
        {errors.address && (
          <p className={styles.error}>{errors.address}</p>
        )}

        <input
          name="landmark"
          placeholder="Landmark (optional)"
          value={form.landmark}
          onChange={handleChange}
          className={styles.input}
        />
      </div>

      {/* ================= PAYMENT ================= */}
      <div className={styles.section}>
        <h3>Payment Method</h3>

        <label className={styles.radioLabel}>
          <input
            type="radio"
            value="cash"
            checked={paymentMethod === "cash"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <FaCashRegister /> Cash on Delivery
        </label>

        <label className={styles.radioLabel}>
          <input
            type="radio"
            value="online"
            checked={paymentMethod === "online"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <FaCreditCard /> Online Payment
        </label>
      </div>

      <button
        className={styles.orderBtn}
        onClick={handleOrder}
        disabled={loading}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
};

export default Checkout;
