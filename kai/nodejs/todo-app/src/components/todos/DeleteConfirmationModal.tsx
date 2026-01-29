import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Content } from '@patternfly/react-core';
import './DeleteConfirmationModal.scss';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  todoTitle?: string;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  todoTitle
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="small">
      <ModalHeader>
        <Content>
          <h1 data-test-id="delete-modal-title">Delete TODO</h1>
        </Content>
      </ModalHeader>
      <ModalBody>
        <Content>
          <p>
            Are you sure you want to delete this TODO?
            {todoTitle && (
              <strong>
                <p>{todoTitle}</p>
              </strong>
            )}
          </p>
        </Content>
      </ModalBody>
      <ModalFooter>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};
