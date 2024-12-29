import Header from "../components/Header";
import Container from "react-bootstrap/Container";
import {Outlet, useLocation} from "react-router";
import Footer from "../components/Footer";
import useShowServerListener from "../hooks/useShowServerListener";

export default function Layout() {
    useShowServerListener();

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