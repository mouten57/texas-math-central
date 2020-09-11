import React from "react";
import { Modal } from "semantic-ui-react";

const ModalExample = (props) => (
  <Modal open={props.open}>
    <Modal.Header>{props.header}</Modal.Header>
    <Modal.Content>
      <Modal.Description>{props.children}</Modal.Description>
    </Modal.Content>
  </Modal>
);

export default ModalExample;
