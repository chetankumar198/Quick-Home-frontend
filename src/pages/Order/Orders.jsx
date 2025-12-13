import React, { useEffect, useState } from "react";
import styles from "./Orders.module.css";
import { useNavigate } from "react-router-dom";

import Maid from "../../assets/maid.webp";
import Iron from "../../assets/iron.webp";
import Helper from "../../assets/helper.webp";
import Driver from "../../assets/driver.webp";
import Chef from "../../assets/chef.webp";
import service1 from "../../assets/service1.webp";

const serviceImages = {
  maid: Maid,
  iron: Iron,
  helper: Helper,
  driver: Driver,
  cook: Chef,
};

const API = import.meta.env.VITE_BACKEND_URL;

// 🔁 Backend → UI status mapping
const statusLabel = {
  pending: "Placed",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    status: "",
    orderName: "",
    timeFilter: "",
  });

  const navigate = useNavigate();

  // ================= FETCH ORDERS =================
  const fetchOrders = async (reset = false) => {
    setLoading(true);

    const query = new URLSearchParams({
      page,
      status: filters.status,
      orderName: filters.orderName,
      timeFilter: filters.timeFilter,
    }).toString();

    try {
      const res = await fetch(`${API}/api/orders/all?${query}`);

      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();

      const fetchedOrders = data.orders || [];

      if (reset) {
        setOrders(fetchedOrders);
      } else {
        setOrders((prev) => [...prev, ...fetchedOrders]);
      }

      setHasMore(fetchedOrders.length === 10);
    } catch (err) {
      console.error("❌ Fetch Orders Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= EFFECT =================
  useEffect(() => {
    fetchOrders(page === 1);
  }, [page]);

  // ================= FILTER HANDLERS =================
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    setPage(1);
    setOrders([]);
    setHasMore(true);
    fetchOrders(true);
  };

  const resetFilters = () => {
    setFilters({ status: "", orderName: "", timeFilter: "" });
    setPage(1);
    setOrders([]);
    setHasMore(true);
    fetchOrders(true);
  };

  // ================= REORDER =================
  const handleReorder = (order) => {
    const serviceCart = order.services.map((item) => ({
      service: item.service,
      quantity: item.quantity,
      gender: "",
      duration: "",
    }));

    localStorage.setItem("cart", JSON.stringify(serviceCart));
    navigate("/checkout");
  };

  // ================= UI =================
  return (
    <div className={styles.ordersContainer}>
      <h2>Your Orders</h2>

      {/* ================= FILTERS ================= */}
      <div className={styles.filters}>
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="pending">Placed</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <input
          name="orderName"
          placeholder="Search service"
          value={filters.orderName}
          onChange={handleFilterChange}
        />

        <select
          name="timeFilter"
          value={filters.timeFilter}
          onChange={handleFilterChange}
        >
          <option value="">All Time</option>
          <option value="30days">Last 30 Days</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="older">Older</option>
        </select>

        <button onClick={applyFilters}>Apply</button>
        <button onClick={resetFilters} className={styles.resetBtn}>
          Reset
        </button>
      </div>

      {/* ================= ORDERS ================= */}
      <div className={styles.orderList}>
        {!loading && orders.length === 0 && <p>No orders found.</p>}

        {orders.map((order) => (
          <div key={order._id} className={styles.orderCard}>
            <h4>Order ID: {order._id}</h4>
            <p><strong>Name:</strong> {order.name}</p>
            <p><strong>Phone:</strong> {order.phone}</p>
            <p><strong>City:</strong> {order.city}</p>
            <p>
              <strong>Status:</strong>{" "}
              {statusLabel[order.status] || order.status}
            </p>
            <p>
              <strong>Placed At:</strong>{" "}
              {new Date(order.placedAt).toLocaleString()}
            </p>

            <ul className={styles.serviceList}>
              {order.services.map((item, i) => (
                <li key={i} className={styles.serviceItem}>
                  <img
                    src={
                      serviceImages[item.service.toLowerCase()] || service1
                    }
                    alt={item.service}
                    className={styles.serviceImage}
                  />
                  <span>
                    {item.service} × {item.quantity} — ₹{item.price}
                  </span>
                </li>
              ))}
            </ul>

            <p><strong>Total:</strong> ₹{order.totalPrice}</p>

            <button onClick={() => handleReorder(order)}>Reorder</button>
          </div>
        ))}
      </div>

      {/* ================= LOAD MORE ================= */}
      {hasMore && !loading && (
        <button
          className={styles.loadMore}
          onClick={() => setPage((p) => p + 1)}
        >
          Load More
        </button>
      )}

      {loading && <p>Loading...</p>}
    </div>
  );
};

export default Orders;
