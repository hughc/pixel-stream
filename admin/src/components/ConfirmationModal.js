import { Button, Modal } from "react-bootstrap";

export function ConfirmationModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Confirmation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Are you sure you want to delete
          <br />
          the imageset `{props.title}`?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onAccept}>Yes</Button>
        <Button onClick={props.onDecline}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
}
