import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Link, useLocation} from "react-router-dom";
import Icon from "/images/icon.png"
import {Col, Row} from "react-bootstrap";

export default function Header() {
    const location = useLocation();
    return (
        <Navbar expand="sm" bg="dark" fixed="top">
            <Container fluid>
                <Navbar.Brand as={Link} to="/" className="ms-3">
                    <Row>
                        <Col>
                            <img
                                src={Icon}
                                width="32"
                                height="32"
                                className="d-inline-block align-top"
                                alt="Logo"
                            />
                        </Col>
                        <Col className="ps-0">
                            GMP
                        </Col>
                    </Row>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav activeKey={location.pathname} className="me-auto">
                        <Nav.Link as={Link} to="/" eventKey="/">Servers</Nav.Link>
                        <Nav.Link as={Link} to="/settings" eventKey="/settings">Settings</Nav.Link>
                        <Nav.Link as={Link} to="/about" eventKey="/about">About</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}