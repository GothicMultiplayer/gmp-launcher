import {Accordion, Button, Col, Modal, Row} from "react-bootstrap";
import DiscordIcon from "bootstrap-icons/icons/discord.svg?react"
import DocsIcon from "bootstrap-icons/icons/journal-code.svg?react"
import GithubIcon from "bootstrap-icons/icons/github.svg?react"
import DownloadIcon from "bootstrap-icons/icons/download.svg?react"
import {useEffect, useState} from "react";

export default function About() {
    const [show, setShow] = useState(false);
    const [version, setVersion] = useState("");

    useEffect(() => {
        (async () => setVersion(await window.electronAPI.getAppVersion()))();
    }, []);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const openLink = (link: string) => {
        window.open(link, "_blank");
    };

    return (<>
            <Row className="py-5 text-center row-cols-1 gy-5">
                <Col>
                    <Row className="justify-content-center gy-3 row-cols-auto">
                        <Col>
                            <Button onClick={() => openLink("https://discord.gg/JHuQvWB")}
                                    className="d-flex align-items-center">
                                <DiscordIcon className="me-2" aria-hidden/>
                                Join on Discord
                            </Button>
                        </Col>
                        <Col>
                            <Button onClick={() => openLink("https://github.com/GothicMultiplayer")}
                                    className="d-flex align-items-center">
                                <GithubIcon className="me-2" aria-hidden/>
                                Github
                            </Button>
                        </Col>
                        <Col>
                            <Button onClick={() => openLink("https://gitlab.com/Telefon/gmp-documentation")}
                                    className="d-flex align-items-center">
                                <DocsIcon className="me-2" aria-hidden/>
                                Developer Docs
                            </Button>
                        </Col>
                        <Col>
                            <Button onClick={handleShow} className="d-flex align-items-center">
                                <DownloadIcon className="me-2" aria-hidden/>
                                Get Server
                            </Button>
                        </Col>
                    </Row>
                </Col>

                <Col>
                    GMP {version} is a multiplayer modification for Gothic II: Night of the Raven
                    <br/>
                    enabling you to play on customized dedicated servers.
                </Col>

                <Accordion as={Col}>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Changelogs</Accordion.Header>
                        <Accordion.Body className="text-start">
                            None
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <Col>
                    <h3>Credits</h3>
                    <div>Former Polish development team (GMPA)</div>
                    <div>Meatbug</div>
                    <div>Gotha</div>
                    <div>Migos</div>
                    <div>Reveares</div>
                    <div>Sabrosa</div>
                    <div>Wolfra</div>
                    <div>Xaga</div>
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Server files</Modal.Title>
                </Modal.Header>
                <Row as={Modal.Body} className="justify-content-center">
                    <Col xs="auto">
                        <Button className="d-flex align-items-center"
                                onClick={() => openLink("https://gitlab.com/Reveares/GMP/uploads/8924129added833f93feea66e0acaf15/GMP_Server_1.6.0_Windows_x64.zip")}>
                            <DownloadIcon className="me-2" aria-hidden/>
                            .exe
                        </Button>
                    </Col>
                    <Col xs="auto">
                        <Button className="d-flex align-items-center"
                                onClick={() => openLink("https://gitlab.com/Reveares/GMP/uploads/3eeecd4c51e2fff40d3c16144addfd6b/gmp-server_1.6.0-0_amd64.deb")}>
                            <DownloadIcon className="me-2" aria-hidden/>
                            .deb
                        </Button>
                    </Col>
                </Row>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}