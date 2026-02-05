import { useState, useEffect, useMemo } from 'react';
import {
  PageSection,
  Button,
  Content,
  ContentVariants,
  Flex,
  FlexItem,
  Dropdown,
  MenuToggle,
  DropdownList,
  DropdownItem,
  Switch,
  Checkbox,
  Label,
  EmptyState,
  EmptyStateBody
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { EditIcon, TrashIcon, TimesIcon } from '@patternfly/react-icons';
import type { Todo } from '../../types/todo';
import { TodoModal } from './TodoModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import {
  loadTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  archiveTodo,
  initializeFromJson
} from '../../utils/todoStorage';
import { isOverdue } from '../../utils/dateUtils';
import { getPriorityColor, COLOR_TOKENS } from '../../utils/colorUtils';
import './TodoList.scss';

type SortDirection = 'asc' | 'desc';

export const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  // Filter states
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);

  // Sort states
  const [sortColumnIndex, setSortColumnIndex] = useState<number | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  useEffect(() => {
    initializeFromJson().then(data => {
      setTodos(data);
    });
  }, []);

  // Compute filtered and sorted todos as derived state using useMemo
  const filteredTodos = useMemo(() => {
    let filtered = todos.filter(todo => todo.status === 'active');

    // Filter by priority
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(todo => todo.priority === selectedPriority);
    }

    // Filter by color
    if (selectedColor !== 'all') {
      filtered = filtered.filter(todo => todo.color === selectedColor);
    }

    // Filter by overdue
    if (showOverdueOnly) {
      filtered = filtered.filter(todo => isOverdue(todo.targetDate));
    }

    // Sort
    if (sortColumnIndex !== undefined) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: string | undefined;
        let bValue: string | undefined;

        switch (sortColumnIndex) {
          case 1: // Title
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          case 4: // Target Date
            aValue = a.targetDate || '';
            bValue = b.targetDate || '';
            break;
          default:
            return 0;
        }

        if (sortDirection === 'asc') {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        } else {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
      });
    }

    return filtered;
  }, [todos, selectedPriority, selectedColor, showOverdueOnly, sortColumnIndex, sortDirection]);

  const handleSort = (_event: React.MouseEvent, index: number, direction: SortDirection) => {
    setSortColumnIndex(index);
    setSortDirection(direction);
  };

  const handlePriorityChange = (priority: string) => {
    setSelectedPriority(priority);
    setIsPriorityOpen(false);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setIsColorOpen(false);
  };

  const handleClearFilters = () => {
    setSelectedPriority('all');
    setSelectedColor('all');
    setShowOverdueOnly(false);
    setSortColumnIndex(undefined);
  };

  const handleCreateTodo = (todoData: Partial<Todo>) => {
    createTodo(todoData);
    refreshTodos();
  };

  const handleUpdateTodo = (todoData: Partial<Todo>) => {
    if (selectedTodo) {
      updateTodo(selectedTodo.id, todoData);
      refreshTodos();
    }
  };

  const handleMarkDone = (id: string) => {
    archiveTodo(id);
    refreshTodos();
  };

  const handleEdit = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedTodo) {
      deleteTodo(selectedTodo.id);
      refreshTodos();
    }
    setIsDeleteModalOpen(false);
    setSelectedTodo(null);
  };

  const refreshTodos = () => {
    setTodos(loadTodos());
  };

  return (
    <>
      <PageSection hasBodyWrapper={false}  className="pf-v6-u-p-md">
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
          <FlexItem>
            <Content>
              <Content component={ContentVariants.h1}>TODO List</Content>
            </Content>
          </FlexItem>
          <FlexItem>
            <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
              Create TODO
            </Button>
          </FlexItem>
        </Flex>
      </PageSection>

      <PageSection hasBodyWrapper={false} className="todo-list__filters">
        <Flex direction={{ default: 'column', lg: 'row' }}>
          <FlexItem grow={{ default: 'grow' }}>
            <Dropdown
              isOpen={isPriorityOpen}
              onOpenChange={setIsPriorityOpen}
              toggle={(toggleRef) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsPriorityOpen(!isPriorityOpen)}
                  isExpanded={isPriorityOpen}
                >
                  Priority: {selectedPriority === 'all' ? 'All' : selectedPriority.charAt(0).toUpperCase() + selectedPriority.slice(1)}
                </MenuToggle>
              )}
            >
              <DropdownList>
                <DropdownItem onClick={() => handlePriorityChange('all')}>All</DropdownItem>
                <DropdownItem onClick={() => handlePriorityChange('high')}>High</DropdownItem>
                <DropdownItem onClick={() => handlePriorityChange('medium')}>Medium</DropdownItem>
                <DropdownItem onClick={() => handlePriorityChange('low')}>Low</DropdownItem>
              </DropdownList>
            </Dropdown>
          </FlexItem>

          <FlexItem grow={{ default: 'grow' }}>
            <Dropdown
              isOpen={isColorOpen}
              onOpenChange={setIsColorOpen}
              toggle={(toggleRef) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsColorOpen(!isColorOpen)}
                  isExpanded={isColorOpen}
                >
                  Color: {selectedColor === 'all' ? 'All' : COLOR_TOKENS[selectedColor as keyof typeof COLOR_TOKENS]?.label || selectedColor}
                </MenuToggle>
              )}
            >
              <DropdownList>
                <DropdownItem onClick={() => handleColorChange('all')}>All</DropdownItem>
                <DropdownItem onClick={() => handleColorChange('red')}>Red</DropdownItem>
                <DropdownItem onClick={() => handleColorChange('orange')}>Orange</DropdownItem>
                <DropdownItem onClick={() => handleColorChange('blue')}>Blue</DropdownItem>
                <DropdownItem onClick={() => handleColorChange('green')}>Green</DropdownItem>
                <DropdownItem onClick={() => handleColorChange('purple')}>Purple</DropdownItem>
                <DropdownItem onClick={() => handleColorChange('gray')}>Gray</DropdownItem>
              </DropdownList>
            </Dropdown>
          </FlexItem>

          <FlexItem>
            <Switch
              id="show-overdue-toggle"
              label="Show Overdue Only"
              isChecked={showOverdueOnly}
              onChange={(_event, checked) => setShowOverdueOnly(checked)}
            />
          </FlexItem>

          <FlexItem>
            <Button icon={<TimesIcon />} variant="plain" onClick={handleClearFilters} style={{ padding: '0' }} />
          </FlexItem>
        </Flex>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        {filteredTodos.length === 0 ? (
          <EmptyState>
            <EmptyStateBody>
              No todos found. Create your first todo to get started.
            </EmptyStateBody>
          </EmptyState>
        ) : (
          <Table aria-label="TODO list">
            <Thead>
              <Tr>
                <Th />
                <Th
                  sort={{
                    sortBy: { index: sortColumnIndex, direction: sortDirection },
                    onSort: handleSort,
                    columnIndex: 1
                  }}
                >
                  Title
                </Th>
                <Th>Priority</Th>
                <Th>Color</Th>
                <Th
                  sort={{
                    sortBy: { index: sortColumnIndex, direction: sortDirection },
                    onSort: handleSort,
                    columnIndex: 4
                  }}
                >
                  Target Date
                </Th>
                <Th>Tags</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredTodos.map(todo => (
                <Tr
                  key={todo.id}
                  className={isOverdue(todo.targetDate) ? 'overdue-row' : ''}
                >
                  <Td>
                    <Checkbox
                      id={`checkbox-${todo.id}`}
                      isChecked={false}
                      onChange={() => handleMarkDone(todo.id)}
                      aria-label={`Mark ${todo.title} as done`}
                    />
                  </Td>
                  <Td>{todo.title}</Td>
                  <Td>
                    {todo.priority && (
                      <Label color={getPriorityColor(todo.priority)}>
                        {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                      </Label>
                    )}
                  </Td>
                  <Td>
                    {todo.color && (
                      <Label
                        style={{
                          backgroundColor: COLOR_TOKENS[todo.color].background,
                          color: '#ffffff'
                        }}
                      >
                        {COLOR_TOKENS[todo.color].label}
                      </Label>
                    )}
                  </Td>
                  <Td>{todo.targetDate || '-'}</Td>
                  <Td>
                    {todo.tags.map(tag => (
                      <Label key={tag} className="pf-v6-u-mr-xs">
                        {tag}
                      </Label>
                    ))}
                  </Td>
                  <Td>
                    <Button icon={<EditIcon />}
                      variant="plain"
                      onClick={() => handleEdit(todo)}
                      style={{ padding: '0' }}
                     />
                    <Button icon={<TrashIcon />}
                      variant="plain"
                      onClick={() => handleDeleteClick(todo)}
                      style={{ padding: '0', marginLeft: "var(--pf-t--global--spacer--sm)" }}
                     />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </PageSection>

      <TodoModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateTodo}
      />

      <TodoModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTodo(null);
        }}
        onSave={handleUpdateTodo}
        todo={selectedTodo}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTodo(null);
        }}
        onConfirm={handleDeleteConfirm}
        todoTitle={selectedTodo?.title}
      />
    </>
  );
};
