import { useNavigate } from "react-router-dom";

const services = [
  {
    id: 1,
    name: "Hire Maid",
    image: "maid.webp",
    path: "/service/maid"
  },
  {
    id: 2,
    name: "Laundry & Ironing",
    image: "iron.webp",
    path: "/service/laundry"
  },
  {
    id: 3,
    name: "Hire Helper",
    image: "helper.webp",
    path: "/service/helper"
  }
];

const Righttest = () => {
  const navigate = useNavigate();

  return (
    <section>
      <h1>Choose Your Service, Get Help Instantly! ⚡</h1>
      <div className="servicesWrapper">
        {services.map((service) => (
          <div key={service.id} className="serviceBox">
            <img src={service.image} alt={service.name} />
            <p>{service.name}</p>
            <button onClick={() => navigate(service.path)}>Book Now</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Righttest;
