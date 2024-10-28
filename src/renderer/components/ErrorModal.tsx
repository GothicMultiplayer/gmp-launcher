import {Button, Modal} from "react-bootstrap";

export default function ErrorModal(props: {
    show: boolean,
    onHide: () => void,
    text: string
}) {
    return <Modal show={props.show} onHide={props.onHide} centered>
        <Modal.Header closeButton>
            <Modal.Title>Connect error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {props.text}
        </Modal.Body>
        <Modal.Footer>
            <Button type="button" variant="secondary" onClick={props.onHide}>
                Close
            </Button>
        </Modal.Footer>
    </Modal>;
}