import { Modal, Button, Text, TextContent, TextVariants } from '@patternfly/react-core';
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
      <div className="delete-modal__header">
        <TextContent>
          <Text component={TextVariants.h1} data-test-id="delete-modal-title">
            Delete TODO
          </Text>
        </TextContent>
      </div>

      <div className="delete-modal__body">
        <TextContent>
          <Text>
            Are you sure you want to delete this TODO?
            {todoTitle && (
              <Text component={TextVariants.p}>
                <strong>{todoTitle}</strong>
              </Text>
            )}
          </Text>
        </TextContent>
      </div>

      <div className="delete-modal__footer">
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};
