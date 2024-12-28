import Header from "../components/Header";
import Container from "react-bootstrap/Container";
import {Outlet, useLocation} from "react-router";
import Footer from "../components/Footer";
import useConnectListener from "../hooks/useConnectListener";

export default function Layout() {
    useConnectListener();

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