import { useState, useEffect } from 'react';
import {
	Button,
	Form,
	FormGroup,
	TextInput,
	TextArea,
	DatePicker,
	Flex,
	FlexItem,
	FormHelperText,
	HelperText,
	HelperTextItem,
	ActionGroup,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter
} from '@patternfly/react-core';
import {
	Tile
} from '@patternfly/react-core/deprecated';
import type { Todo, TodoFormData } from '../../types/todo';
import { COLOR_TOKENS } from '../../utils/colorUtils';
import { isValidDate, convertToMMDDYYYY } from '../../utils/dateUtils';
import './TodoModal.scss';

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (todoData: Partial<Todo>) => void;
  todo?: Todo | null;
}

export const TodoModal: React.FC<TodoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  todo
}) => {
  const isEdit = !!todo;

  const [formData, setFormData] = useState<TodoFormData>({
    title: '',
    description: '',
    targetDate: '',
    priority: undefined,
    color: undefined,
    tagsString: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Define handleReset before it's used in useEffect
  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      targetDate: '',
      priority: undefined,
      color: undefined,
      tagsString: ''
    });
    setErrors({});
  };

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title,
        description: todo.description || '',
        targetDate: todo.targetDate || '',
        priority: todo.priority,
        color: todo.color,
        tagsString: todo.tags.join(', ')
      });
    } else {
      handleReset();
    }
  }, [todo, isOpen]);

  const handleFieldChange = (field: keyof TodoFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.targetDate && !isValidDate(formData.targetDate)) {
      newErrors.targetDate = 'Invalid date format. Use MM/DD/YYYY';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!validateForm()) {
      return;
    }

    const tags = formData.tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const todoData: Partial<Todo> = {
      title: formData.title.trim(),
      description: formData.description?.trim() || undefined,
      targetDate: formData.targetDate || undefined,
      priority: formData.priority,
      color: formData.color,
      tags
    };

    onSave(todoData);
    onClose();
  };

  const handleDateChange = (value: string) => {
    // DatePicker may return different formats, normalize to MM/DD/YYYY
    const normalizedDate = convertToMMDDYYYY(value);
    handleFieldChange('targetDate', normalizedDate);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader 
        title={isEdit ? 'Edit TODO' : 'Create New TODO'} 
        data-test-id="modal-title" 
      />
      
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          {/* Title - REQUIRED */}
          <FormGroup label="Title" fieldId="todo-title" isRequired>
            <TextInput
              id="todo-title"
              name="title"
              value={formData.title}
              onChange={(_event, value) => handleFieldChange('title', value)}
              validated={errors.title ? 'error' : 'default'}
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem variant={errors.title ? 'error' : 'default'}>
                  {errors.title || 'Enter a descriptive title for this TODO'}
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>

          {/* Description - OPTIONAL */}
          <FormGroup label="Description" fieldId="todo-description">
            <TextArea
              id="todo-description"
              name="description"
              value={formData.description}
              onChange={(_event, value) => handleFieldChange('description', value)}
              rows={4}
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem>Optional: Add more details about this TODO</HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>

          {/* Target Date - OPTIONAL */}
          <FormGroup label="Target Date" fieldId="todo-date">
            <DatePicker
              value={formData.targetDate}
              onChange={(_event, value) => handleDateChange(value)}
              placeholder="MM/DD/YYYY"
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem variant={errors.targetDate ? 'error' : 'default'}>
                  {errors.targetDate || 'Optional: Set a target completion date'}
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>

          {/* Priority - OPTIONAL - Using Tiles */}
          <FormGroup label="Priority" fieldId="todo-priority">
            <Flex>
              <FlexItem span={3}>
                <Tile
                  title="High"
                  onClick={() => handleFieldChange('priority', 'high')}
                  isSelected={formData.priority === 'high'}
                  data-test="priority-high"
                />
              </FlexItem>
              <FlexItem span={3}>
                <Tile
                  title="Medium"
                  onClick={() => handleFieldChange('priority', 'medium')}
                  isSelected={formData.priority === 'medium'}
                  data-test="priority-medium"
                />
              </FlexItem>
              <FlexItem span={3}>
                <Tile
                  title="Low"
                  onClick={() => handleFieldChange('priority', 'low')}
                  isSelected={formData.priority === 'low'}
                  data-test="priority-low"
                />
              </FlexItem>
            </Flex>
            <FormHelperText>
              <HelperText>
                <HelperTextItem>Optional: Select priority level</HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>

          {/* Color - OPTIONAL - Using Tiles */}
          <FormGroup label="Color Label" fieldId="todo-color">
            <Flex>
              {(['red', 'orange', 'blue', 'green', 'purple', 'gray'] as const).map(color => (
                <FlexItem key={color} span={2}>
                  <Tile
                    title={COLOR_TOKENS[color].label}
                    onClick={() => handleFieldChange('color', color)}
                    isSelected={formData.color === color}
                    data-test={`color-${color}`}
                    style={{
                      backgroundColor: formData.color === color
                        ? COLOR_TOKENS[color].background
                        : 'transparent',
                      border: `var(--pf-v5-global--BorderWidth--sm) solid ${COLOR_TOKENS[color].background}`,
                      color: formData.color === color ? '#ffffff' : COLOR_TOKENS[color].background
                    }}
                  />
                </FlexItem>
              ))}
            </Flex>
            <FormHelperText>
              <HelperText>
                <HelperTextItem>Optional: Choose a color label for this TODO</HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>

          {/* Tags - OPTIONAL */}
          <FormGroup label="Tags" fieldId="todo-tags">
            <TextInput
              id="todo-tags"
              name="tags"
              value={formData.tagsString}
              onChange={(_event, value) => handleFieldChange('tagsString', value)}
              placeholder="work, urgent, review"
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem>Optional: Enter comma-separated tags</HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
        </Form>
      </ModalBody>

      <ModalFooter>
        <ActionGroup>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isDisabled={!formData.title.trim()}
          >
            {isEdit ? 'Update' : 'Create'}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="link" onClick={handleReset} isInline>
            Reset
          </Button>
        </ActionGroup>
      </ModalFooter>
    </Modal>
  );
};
