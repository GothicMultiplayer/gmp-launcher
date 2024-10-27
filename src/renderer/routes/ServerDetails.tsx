import {Button, Col, Row} from "react-bootstrap";
import BackIcon from "bootstrap-icons/icons/arrow-left.svg?react"
import PlayersIcon from "bootstrap-icons/icons/person-fill.svg?react"
import {Link, useParams} from "react-router-dom";
import Form from "react-bootstrap/Form";
import useServer from "../hooks/useServer";

export default function ServerDetails() {
    const { id } = useParams();
    const {data: server} = useServer(id ?? "");
    if (server === undefined) {
        return <>Loading...</>
    }

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
                                <Form.Control type="text" maxLength={19} placeholder=" "></Form.Control>
                            </Form.Group>
                        </div>
                        <div>
                            <Button className="mt-3" disabled>Connect</Button>
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
        </>
    );
}