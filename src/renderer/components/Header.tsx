import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Link, useLocation} from "react-router-dom";
import Icon from "/images/icon.png"
import {Col, Row} from "react-bootstrap";

// Component height needs to be the same as BrowserWindow.titleBarOverlay.size
export default function Header() {
    const location = useLocation();
    return (
        <Navbar expand="sm" bg="dark" sticky="top" className="app-navbar app-draggable">
            <Container fluid>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="app-non-draggable border-0"/>
                <Navbar.Brand as={Link} to="/" className="ms-3 app-non-draggable d-none d-sm-inline">
                    <Row>
                        <Col className="ps-0 d-flex align-items-center">
                            <img
                                src={Icon}
                                width="22"
                                height="22"
                                className="d-inline-block align-top"
                                alt="Logo"
                            />
                        </Col>
                        <Col className="ps-0">
                            GMP
                        </Col>
                    </Row>
                </Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav activeKey={location.pathname} className="me-auto">
                        <Nav.Link as={Link} to="/" eventKey="/" className="app-non-draggable">Servers</Nav.Link>
                        <Nav.Link as={Link} to="/settings" eventKey="/settings" className="app-non-draggable">Settings</Nav.Link>
                        <Nav.Link as={Link} to="/about" eventKey="/about" className="app-non-draggable">About</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}