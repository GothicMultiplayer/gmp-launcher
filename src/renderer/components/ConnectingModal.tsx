import {Modal} from "react-bootstrap";

export default function ConnectingModal(props: {
    show: boolean,
    onHide: () => void,
    text: string
}) {
    return <Modal show={props.show} onHide={props.onHide} centered backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
            <Modal.Title>Connecting</Modal.Title>
        </Modal.Header>
        <Modal.Body className="my-2">
            {props.text}
        </Modal.Body>
    </Modal>;
}