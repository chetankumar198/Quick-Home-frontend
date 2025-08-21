import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./components/context/CartContext";
import { AuthProvider } from "./components/context/AuthContext";
import Home from "./pages/Home";
import Products from "./pages/product/Products";
import ProductPage from "./pages/product/Products";
import About from "./pages/About/About";
import Contact from "./pages/contact/Contact";
import Layout from "./components/Layout/Layout";
import Cart from "./pages/Cart/Cart";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/login/login";
import Checkout from "./pages/payement/payment";
import MyAccount from "./pages/MyAccount/MyAccount.jsx";
import Orders from "./pages/Order/Orders.jsx"; // ✅ Import Orders

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/products/:serviceType" element={<ProductPage />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/account" element={<MyAccount />} />
                            <Route path="/orders" element={<Orders />} /> {/* ✅ Fixed */}
                        </Routes>
                    </Layout>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
