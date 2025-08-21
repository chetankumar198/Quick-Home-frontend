import { useLocation } from "react-router-dom";
import Header from "../Header/header";
import Footer from "../Footer/Footer";
import styles from "./Layout.module.css";

const Layout = ({ children }) => {
    const location = useLocation();

    // Add any paths where the footer should be hidden
    const hideFooterPaths = ["/signup", "/login" ,"/checkout"];
    const shouldHideFooter = hideFooterPaths.includes(location.pathname);

    return (
        <div className={styles.layout}>
            <Header />
            <div className={styles.contentWrapper}>
                {children}
                {!shouldHideFooter && <Footer className={styles.footer} />}
            </div>
        </div>
    );
};

export default Layout;
