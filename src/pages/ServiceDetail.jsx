import { useParams } from "react-router-dom";

const serviceDetails = {
    maid: {
        name: "Hire Maid",
        description: "Professional maid services for household cleaning and chores.",
        price: "Starting from $10/hour",
        image: "/assets/maid.webp",
    },
    laundry: {
        name: "Laundry & Ironing",
        description: "Get your clothes washed and ironed with professional care.",
        price: "Starting from $5 per kg",
        image: "/assets/iron.webp",
    },
    helper: {
        name: "Hire Helper",
        description: "General helpers for household or event assistance.",
        price: "Starting from $8/hour",
        image: "/assets/helper.webp",
    },
    driver: {
        name: "Hire Driver",
        description: "Book a professional driver for personal or business needs.",
        price: "Starting from $15/hour",
        image: "/assets/driver.webp",
    },
    cook: {
        name: "Hire Cook",
        description: "Skilled cooks available for home-cooked meals.",
        price: "Starting from $12/hour",
        image: "/assets/chef.webp",
    },
};

const ServiceDetail = () => {
    const { serviceName } = useParams();
    const service = serviceDetails[serviceName];

    if (!service) {
        return <h1 style={{ textAlign: "center" }}>Service Not Found</h1>;
    }

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>{service.name}</h1>
            <img 
                src={service.image} 
                alt={service.name} 
                style={{ width: "300px", borderRadius: "10px" }} 
            />
            <p>{service.description}</p>
            <p><strong>Price:</strong> {service.price}</p>
        </div>
    );
};

export default ServiceDetail;
