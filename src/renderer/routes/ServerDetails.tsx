import {Button, Col, Row} from "react-bootstrap";
import BackIcon from "bootstrap-icons/icons/arrow-left.svg?react"
import PlayersIcon from "bootstrap-icons/icons/person-fill.svg?react"
import {Link, useParams} from "react-router-dom";
import Form from "react-bootstrap/Form";
import useServer from "../hooks/useServer";
import {useState} from "react";
import ErrorModal from "../components/ErrorModal";
import ConnectingModal from "../components/ConnectingModal";
import useAvailableVersions from "../hooks/useAvailableVersions";

export default function ServerDetails() {
    const [nickname, setNickname] = useState("");

    const [showError, setShowError] = useState(false);
    const [errorText, setErrorText] = useState<string>("");
    
    const [showConnecting, setShowConnecting] = useState(false);
    const [connectingText, setConnectingText] = useState<string>("");
    
    const {versions, isLoading} = useAvailableVersions();
    
    const { id } = useParams();
    const {data: server} = useServer(id ?? "");
    if (server === undefined) {
        return <>Loading...</>
    }
    
    async function connect() {
        if (!server) {
            return;
        }
        
        setConnectingText(`Connecting to server ${server.name}...`);
        setShowConnecting(true);
        setShowError(false);
        
        const result = await window.electronAPI.connectToServer(server.url, nickname, server.version);
        if (result.error) {
            setShowConnecting(false);
            setErrorText(result.error);
            setShowError(true);
        } else {
            setShowConnecting(false);
            await window.electronAPI.minimize();
        }
    }
    
    const versionAvailable = isLoading || versions.includes(server.version);

    return (
        <>
            <div className="py-5">
                <Row>
                    <Col xs="auto">
                        <Button as={Link} variant="dark" to="/">
                            <BackIcon aria-label="back to server list"/>
                        </Button>
                    </Col>
                    <Col as="h1" className="texturina">
                        {server.name}
                    </Col>
                </Row>
                <Row>
                    <Col xs={3}>
                        <div className="d-flex align-items-center">
                            <PlayersIcon aria-label="Players" className="me-2"/>
                            {server.players}<span className="text-muted">/{server.maxPlayers}</span>
                        </div>
                        <div>
                            <Form.Group className="mt-3" controlId="nickname">
                                <Form.Label>Nickname</Form.Label>
                                <Form.Control type="text" maxLength={19} value={nickname} onChange={(e) => setNickname(e.target.value)}></Form.Control>
                            </Form.Group>
                        </div>
                        <div>
                            <Button className="mt-3" onClick={connect} disabled={!versionAvailable}>Connect</Button>
                            {!versionAvailable &&
                                <div className="text-danger mt-2">Version {server.version} not available</div>
                            }
                        </div>
                    </Col>
                    <Col className="description-pre-line">
                        {server.description}
                    </Col>
                    <Col xs={2}>
                        <Row className="row-cols-1 gy-3">
                            <Col>Gamemode</Col>
                            <Col>Website</Col>
                            <Col>Discord</Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            <ErrorModal show={showError} onHide={() => setShowError(false)} text={errorText}/>
            <ConnectingModal show={showConnecting} onHide={() => setShowConnecting(false)} text={connectingText}/>
        </>
    );
}