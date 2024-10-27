import Header from "../components/Header";
import Container from "react-bootstrap/Container";
import {Outlet, useLocation} from "react-router-dom";
import Footer from "../components/Footer";

export default function Layout() {
    const location = useLocation();
    const showFooter = location.pathname === "/about";
    return (<>
        <Header/>
        <Container as="main">
            <Outlet/>
        </Container>
        {showFooter &&
            <Footer/>
        }
    </>);
}