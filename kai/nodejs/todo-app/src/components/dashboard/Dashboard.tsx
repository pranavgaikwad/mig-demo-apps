import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageSection,
  Grid,
  GridItem,
  Card,
  CardTitle,
  CardBody,
  Button,
  Text,
  TextContent,
  TextVariants,
  Flex,
  FlexItem,
  DataList,
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  DataListCell,
  Checkbox,
  Label,
  Form,
  FormGroup,
  TextInput,
  ActionGroup
} from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons';
import type { Todo } from '../../types/todo';
import { TodoModal } from '../todos/TodoModal';
import {
  loadTodos,
  createTodo,
  archiveTodo,
  initializeFromJson
} from '../../utils/todoStorage';
import { isOverdue, isToday } from '../../utils/dateUtils';
import { getPriorityColor, COLOR_TOKENS } from '../../utils/colorUtils';
import './Dashboard.scss';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isQuickCreateExpanded, setIsQuickCreateExpanded] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');

  useEffect(() => {
    initializeFromJson().then(data => {
      setTodos(data);
    });
  }, []);

  const refreshTodos = () => {
    setTodos(loadTodos());
  };

  // Calculate statistics
  const activeTodos = todos.filter(t => t.status === 'active');
  const totalCount = activeTodos.length;

  const overdueTodos = activeTodos.filter(t => isOverdue(t.targetDate));
  const overdueCount = overdueTodos.length;

  const completedToday = todos.filter(t =>
    t.status === 'archived' && t.updatedAt && isToday(t.updatedAt)
  );
  const completedTodayCount = completedToday.length;

  // Get top 5 overdue items, sorted by date (oldest first)
  const top5Overdue = [...overdueTodos]
    .sort((a, b) => {
      if (!a.targetDate) return 1;
      if (!b.targetDate) return -1;
      return a.targetDate.localeCompare(b.targetDate);
    })
    .slice(0, 5);

  const handleCreateTodo = (todoData: Partial<Todo>) => {
    createTodo(todoData);
    refreshTodos();
  };

  const handleQuickCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTitle.trim()) {
      createTodo({ title: quickTitle.trim() });
      setQuickTitle('');
      setIsQuickCreateExpanded(false);
      refreshTodos();
    }
  };

  const handleMarkDone = (id: string) => {
    archiveTodo(id);
    refreshTodos();
  };

  return (
    <>
      <PageSection variant="light" className="dashboard__header">
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
          <FlexItem>
            <TextContent>
              <Text component={TextVariants.h1}>TODO Dashboard</Text>
            </TextContent>
          </FlexItem>
          <FlexItem>
            <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
              Create TODO
            </Button>
          </FlexItem>
        </Flex>
      </PageSection>

      <PageSection>
        <Grid hasGutter>
          {/* Summary Cards */}
          <GridItem xl={4} lg={4} md={4} sm={12}>
            <Card className="dashboard__stats-card">
              <CardTitle>
                <Text component={TextVariants.h3}>Total TODOs</Text>
              </CardTitle>
              <CardBody>
                <Text
                  component={TextVariants.h1}
                  className="stat-number"
                  style={{ fontSize: 'var(--pf-v5-global--FontSize--4xl)' }}
                >
                  {totalCount}
                </Text>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem xl={4} lg={4} md={4} sm={12}>
            <Card className="dashboard__stats-card">
              <CardTitle>
                <Text component={TextVariants.h3}>Overdue TODOs</Text>
              </CardTitle>
              <CardBody>
                <Text
                  component={TextVariants.h1}
                  className="stat-number"
                  style={{
                    fontSize: 'var(--pf-v5-global--FontSize--4xl)',
                    color: 'var(--pf-v5-global--danger-color--100)'
                  }}
                >
                  {overdueCount}
                </Text>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem xl={4} lg={4} md={4} sm={12}>
            <Card className="dashboard__stats-card">
              <CardTitle>
                <Text component={TextVariants.h3}>Completed Today</Text>
              </CardTitle>
              <CardBody>
                <Text
                  component={TextVariants.h1}
                  className="stat-number"
                  style={{
                    fontSize: 'var(--pf-v5-global--FontSize--4xl)',
                    color: 'var(--pf-v5-global--success-color--100)'
                  }}
                >
                  {completedTodayCount}
                </Text>
              </CardBody>
            </Card>
          </GridItem>

          {/* Overdue TODOs Section */}
          <GridItem xl={12} lg={12} md={12} sm={12}>
            <Card className="dashboard__overdue-section">
              <CardTitle>
                <Text component={TextVariants.h2}>Overdue TODOs</Text>
              </CardTitle>
              <CardBody>
                {top5Overdue.length === 0 ? (
                  <TextContent>
                    <Text>No overdue TODOs</Text>
                  </TextContent>
                ) : (
                  <DataList aria-label="Overdue todos">
                    {top5Overdue.map(todo => (
                      <DataListItem key={todo.id} className="overdue-todo-item">
                        <DataListItemRow>
                          <DataListItemCells
                            dataListCells={[
                              <DataListCell key="checkbox">
                                <Checkbox
                                  id={`dash-checkbox-${todo.id}`}
                                  isChecked={false}
                                  onChange={() => handleMarkDone(todo.id)}
                                  aria-label={`Mark ${todo.title} as done`}
                                />
                              </DataListCell>,
                              <DataListCell key="title" width={3}>
                                <TextContent>
                                  <Text component={TextVariants.p}>
                                    <strong>{todo.title}</strong>
                                  </Text>
                                </TextContent>
                              </DataListCell>,
                              <DataListCell key="priority" width={1}>
                                {todo.priority && (
                                  <Label color={getPriorityColor(todo.priority)}>
                                    {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                                  </Label>
                                )}
                              </DataListCell>,
                              <DataListCell key="color" width={1}>
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
                              </DataListCell>,
                              <DataListCell key="date" width={1}>
                                <Text>{todo.targetDate}</Text>
                              </DataListCell>
                            ]}
                          />
                        </DataListItemRow>
                      </DataListItem>
                    ))}
                  </DataList>
                )}
                <div style={{ marginTop: 'var(--pf-v5-global--spacer--md)' }}>
                  <Button variant="link" onClick={() => navigate('/todos')}>
                    View All TODOs
                  </Button>
                </div>
              </CardBody>
            </Card>
          </GridItem>

          {/* Quick Create TODO */}
          <GridItem xl={12} lg={12} md={12} sm={12}>
            <Card>
              <CardTitle>
                <Text component={TextVariants.h2}>Quick Create TODO</Text>
              </CardTitle>
              <CardBody>
                {!isQuickCreateExpanded ? (
                  <Button
                    variant="secondary"
                    onClick={() => setIsQuickCreateExpanded(true)}
                  >
                    <PlusCircleIcon /> Expand to Create
                  </Button>
                ) : (
                  <Form onSubmit={handleQuickCreate}>
                    <FormGroup label="Title" fieldId="quick-title" isRequired>
                      <TextInput
                        id="quick-title"
                        value={quickTitle}
                        onChange={(_event, value) => setQuickTitle(value)}
                        placeholder="Enter TODO title"
                      />
                    </FormGroup>
                    <ActionGroup>
                      <Button variant="primary" type="submit">Save</Button>
                      <Button
                        variant="link"
                        onClick={() => {
                          setIsQuickCreateExpanded(false);
                          setQuickTitle('');
                        }}
                      >
                        Cancel
                      </Button>
                    </ActionGroup>
                  </Form>
                )}
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>

      <TodoModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateTodo}
      />
    </>
  );
};
