import {
	Button,
	Content,
	ContentVariants,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter
} from '@patternfly/react-core';
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader title="Delete TODO" data-test-id="delete-modal-title" />
      
      <ModalBody>
        <Content>
          <Content component="p">
            Are you sure you want to delete this TODO?
            {todoTitle && (
              <Content component={ContentVariants.p}>
                <strong>{todoTitle}</strong>
              </Content>
            )}
          </Content>
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
