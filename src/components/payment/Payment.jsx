// import { useLocation, useNavigate } from "react-router-dom";
// import styles from "./Payment.module.css";

// const Payment = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const searchParams = new URLSearchParams(location.search);
//     const service = searchParams.get("service");
//     const gender = searchParams.get("gender");

//     const handlePayment = async () => {
//         const response = await fetch("http://localhost:5000/api/payment/pay", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ amount: 50, currency: "INR" }),
//         });

//         const data = await response.json();
//         if (data.success) {
//             const options = {
//                 key: "your_razorpay_key_id", // Replace with your actual Razorpay key
//                 amount: data.order.amount,
//                 currency: data.order.currency,
//                 name: "Service Booking",
//                 description: "Payment for hiring service",
//                 order_id: data.order.id,
//                 handler: function (response) {
//                     alert("Payment Successful! Your service has been booked.");
//                     navigate("/");
//                 },
//                 prefill: {
//                     name: "Your Name",
//                     email: "your@email.com",
//                     contact: "9876543210",
//                 },
//             };
//             const rzp = new window.Razorpay(options);
//             rzp.open();
//         } else {
//             alert("Payment failed! Try again.");
//         }
//     };

//     return (
//         <div className={styles.container}>
//             <h1 className={styles.title}>Confirm Your Booking</h1>
//             <div className={styles.details}>
//                 <p><strong>Service:</strong> {service}</p>
//                 <p><strong>Preferred Gender:</strong> {gender}</p>
//                 <p><strong>Amount:</strong> ₹50</p>
//             </div>
//             <button className={styles.payButton} onClick={handlePayment}>Proceed to Pay</button>
//         </div>
//     );
// };

// export default Payment;
