import {
	Button,
	Content,
	ContentVariants,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter
} from '@patternfly/react-core';

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
      <ModalHeader>
        <Content>
          <Content component={ContentVariants.h1} data-test-id="delete-modal-title">
            Delete TODO
          </Content>
        </Content>
      </ModalHeader>

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
