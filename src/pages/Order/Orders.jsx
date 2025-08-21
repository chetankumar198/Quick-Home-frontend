import React, { useEffect, useState } from "react";
import styles from "./Orders.module.css";
import { useNavigate } from "react-router-dom";
import Maid from "../../assets/maid.webp";
import Iron from "../../assets/iron.webp";
import Helper from "../../assets/helper.webp";
import Driver from "../../assets/driver.webp";
import Chef from "../../assets/chef.webp";
import service1 from "../../assets/service1.webp";
import MaleIcon from "../../assets/man.webp";
import FemaleIcon from "../../assets/women.webp";
import AnyIcon from "../../assets/man and women.webp";

const serviceImages = {
  maid: Maid,
  iron: Iron,
  helper: Helper,
  driver: Driver,
  cook: Chef,
};

const genderIcons = {
  male: MaleIcon,
  female: FemaleIcon,
  any: AnyIcon,
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

  const mergeOrders = (prevOrders, newOrders) => {
    const seen = new Set(prevOrders.map((o) => o._id));
    return [...prevOrders, ...newOrders.filter((o) => !seen.has(o._id))];
  };

  const fetchOrders = async (isFilterApplied = false) => {
    setLoading(true);
    const query = new URLSearchParams({
      page,
      status: filters.status,
      orderName: filters.orderName,
      timeFilter: filters.timeFilter,
    }).toString();

    try {
      const res = await fetch(`http://localhost:5000/api/orders/all?${query}`);
      const data = await res.json();
      const newOrders = data.orders || [];

      if (newOrders.length < 10) setHasMore(false);

      if (isFilterApplied || page === 1) {
        setOrders(newOrders);
      } else {
        setOrders((prev) => mergeOrders(prev, newOrders));
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

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

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    setOrders([]);
    setPage(1);
    setHasMore(true);
    fetchOrders(true);
  };

  const resetFilters = () => {
    setFilters({ status: "", orderName: "", timeFilter: "" });
    setOrders([]);
    setPage(1);
    setHasMore(true);
    fetchOrders(true);
  };

  return (
    <div className={`${styles.ordersContainer} dark-theme`}>
      <h2>Your Orders</h2>

      {/* Filter Section */}
      <div className={styles.filters}>
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="placed">Placed</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
        </select>

        <input
          name="orderName"
          placeholder="Search Your Order"
          value={filters.orderName}
          onChange={handleFilterChange}
        />

        <select name="timeFilter" value={filters.timeFilter} onChange={handleFilterChange}>
          <option value="">All Time</option>
          <option value="30days">Last 30 Days</option>
          <option value="2025">Year 2025</option>
          <option value="2024">Year 2024</option>
          <option value="2023">Year 2023</option>
          <option value="older">Older</option>
        </select>

        <button onClick={applyFilters}>Apply Filters</button>
        <button className={styles.resetBtn} onClick={resetFilters}>Reset Filters</button>
      </div>

      {/* Orders List */}
      <div className={styles.orderList}>
        {orders.length === 0 && !loading && <p>No orders found.</p>}

        {orders.map((order) => (
          <div key={order._id} className={`${styles.orderCard} ${styles.fadeIn}`}>
            <h4>Order ID: {order._id}</h4>
            <p><strong>Name:</strong> {order.name}</p>
            <p><strong>Phone:</strong> {order.phone}</p>
            <p><strong>City:</strong> {order.city}</p>
            <p><strong>Status:</strong> {order.status || "Placed"}</p>
            <p><strong>Placed At:</strong> {new Date(order.placedAt).toLocaleString()}</p>

            <ul className={styles.serviceList}>
              {order.services.map((item, i) => (
                <li key={i} className={styles.serviceItem}>
                  <img
                    src={serviceImages[item.service.toLowerCase()] || service1}
                    alt={item.service}
                    className={styles.serviceImage}
                  />
                  <span>{item.service} × {item.quantity} — ₹{item.price}</span>
                  {item.gender && (
                    <img
                      src={genderIcons[item.gender.toLowerCase()] || AnyIcon}
                      alt={item.gender}
                      className={styles.genderIcon}
                    />
                  )}
                </li>
              ))}
            </ul>

            <p><strong>Total:</strong> ₹{order.totalPrice}</p>
            <button onClick={() => handleReorder(order)}>Reorder</button>
          </div>
        ))}
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
        </div>
      )}

      {/* Load More */}
      {hasMore && !loading && (
        <button className={styles.loadMore} onClick={() => setPage((p) => p + 1)}>
          Load More
        </button>
      )}
    </div>
  );
};

export default Orders;
