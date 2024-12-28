import {Button, FormControl, InputGroup, Modal} from "react-bootstrap";
import {ChangeEvent, KeyboardEvent} from "react";

export default function AddServerModal(props: {
    show: boolean,
    onHide: () => void,
    addUrl: string | null,
    invalid: boolean,
    onChange: (event: ChangeEvent<HTMLInputElement>) => void,
    onClick: () => void
}) {
    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            props.onClick();
        }
    }

    return <Modal show={props.show} onHide={props.onHide} centered>
        <Modal.Header closeButton>
            <Modal.Title>Add server</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <InputGroup hasValidation>
                <FormControl type="url" pattern="https?://.*" required isInvalid={!!props.addUrl && props.invalid}
                             value={props.addUrl ?? ""} onChange={props.onChange} onKeyDown={onKeyDown}
                             placeholder="https://host:port"/>
                <FormControl.Feedback type="invalid">
                    Please enter a valid HTTPS URL.
                </FormControl.Feedback>
            </InputGroup>
        </Modal.Body>
        <Modal.Footer>
            <Button type="button" variant="secondary" onClick={props.onHide}>
                Close
            </Button>
            <Button type="submit" variant="primary" disabled={!props.addUrl || props.invalid} onClick={props.onClick}>
                Add
            </Button>
        </Modal.Footer>
    </Modal>;
}