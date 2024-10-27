import {Button, Modal} from "react-bootstrap";

export default function RemoveServerModal(props: {
    show: boolean,
    onHide: () => void,
    serverName: string|null,
    onClick: () => void
}) {
    return <Modal show={props.show} onHide={props.onHide} centered>
        <Modal.Header closeButton>
            <Modal.Title>Remove server</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Remove manual added server {props.serverName}?
        </Modal.Body>
        <Modal.Footer>
            <Button type="button" variant="secondary" onClick={props.onHide}>
                Close
            </Button>
            <Button type="submit" variant="danger" onClick={props.onClick}>
                Remove
            </Button>
        </Modal.Footer>
    </Modal>;
}