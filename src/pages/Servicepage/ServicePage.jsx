import { useParams } from "react-router-dom";

const ServicePage = () => {
  const { serviceName } = useParams();
  return <h1>Welcome to {serviceName} Service Page</h1>;
};

export default ServicePage;
