import { Modal, Button, Content, Title } from '@patternfly/react-core';
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
        <Content>
          <Title headingLevel="h1" data-test-id="delete-modal-title">
            Delete TODO
          </Title>
        </Content>
      </div>

      <div className="delete-modal__body">
        <Content>
          <p>
            Are you sure you want to delete this TODO?
            {todoTitle && (
              <p>
                <strong>{todoTitle}</strong>
              </p>
            )}
          </p>
        </Content>
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
