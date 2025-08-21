import React, { useState } from 'react';
import styles from './payment.module.css';
import { useCart } from '../../components/context/CartContext';
import { FaCashRegister, FaCreditCard } from 'react-icons/fa';  // Payment icons

import Maid from '../../assets/maid.webp';
import Cook from '../../assets/chef.webp';
import Driver from '../../assets/driver.webp';
import Helper from '../../assets/helper.webp';
import Iron from '../../assets/iron.webp';
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
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
    landmark: '',
  });

  const [errors, setErrors] = useState({});

  const totalPrice = cart.reduce(
    (acc, item) => acc + (servicePrices[item.service] || 0) * item.quantity,
    0
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.phone || form.phone.length !== 10) newErrors.phone = 'Valid phone number required';
    if (!form.address) newErrors.address = 'Address is required';
    if (!form.pincode) newErrors.pincode = 'Pincode is required';
    if (!form.city) newErrors.city = 'City is required';
    if (!form.state) newErrors.state = 'State is required';
    return newErrors;
  };

  const handleOrder = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const orderData = {
      name: form.name,
      phone: form.phone,
      address: form.address,
      pincode: form.pincode,
      city: form.city,
      state: form.state,
      landmark: form.landmark,
      services: cart.map(item => ({
        service: item.service,
        quantity: item.quantity,
        price: servicePrices[item.service] * item.quantity,
      })),
      totalPrice: totalPrice,
      paymentMethod: paymentMethod,
    };

    try {
      const response = await fetch("http://localhost:5000/api/orders/place-order", {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);  // Show success message
      } else {
        alert("Error placing order");
      }
    } catch (error) {
      console.error(error);
      alert("Error placing order");
    }
  };

  return (
    <div className={styles.checkoutContainer}>
      <h2>Checkout</h2>

      <div className={styles.section}>
        <h3>Service Summary</h3>
        {cart.map((item, index) => (
          <div key={index} className={styles.itemCard}>
            <img
              src={serviceImages[item.service]}
              alt={item.service}
              className={styles.itemImage}
            />
            <div>
              <h4>{item.service.charAt(0).toUpperCase() + item.service.slice(1)}</h4>
              <p>Gender: {item.gender}</p>
              <p>Duration: {item.duration}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ₹{(servicePrices[item.service] || 0) * item.quantity}</p>
            </div>
          </div>
        ))}
        <p className={styles.totalPrice}><strong>Total Price:</strong> ₹{totalPrice}</p>
      </div>

      <div className={styles.section}>
        <h3>Delivery Details</h3>
        <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className={styles.input} />
        {errors.name && <p className={styles.error}>{errors.name}</p>}

        <input type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} className={styles.input} />
        {errors.phone && <p className={styles.error}>{errors.phone}</p>}

        <textarea name="address" placeholder="Full Address (House No, Street, Area)" value={form.address} onChange={handleChange} className={styles.textarea} />
        {errors.address && <p className={styles.error}>{errors.address}</p>}

        <input type="text" name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} className={styles.input} />
        {errors.pincode && <p className={styles.error}>{errors.pincode}</p>}

        <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} className={styles.input} />
        {errors.city && <p className={styles.error}>{errors.city}</p>}

        <input type="text" name="state" placeholder="State" value={form.state} onChange={handleChange} className={styles.input} />
        {errors.state && <p className={styles.error}>{errors.state}</p>}

        <input type="text" name="landmark" placeholder="Landmark (optional)" value={form.landmark} onChange={handleChange} className={styles.input} />
      </div>

      <div className={styles.section}>
        <h3>Payment Method</h3>
        <label className={styles.radioLabel}>
          <input
            type="radio"
            name="payment"
            value="cash"
            checked={paymentMethod === 'cash'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <FaCashRegister /> Payment with cash
        </label>
        <label className={styles.radioLabel}>
          <input
            type="radio"
            name="payment"
            value="online"
            checked={paymentMethod === 'online'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <FaCreditCard /> Online Payment
        </label>
      </div>

      <button className={styles.orderBtn} onClick={handleOrder}>
        Place Order
      </button>
    </div>
  );
};

export default Checkout;
