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
  Content,
  ContentVariants,
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
      <PageSection hasBodyWrapper={false}  className="dashboard__header">
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
          <FlexItem>
            <Content>
              <Content component={ContentVariants.h1}>TODO Dashboard</Content>
            </Content>
          </FlexItem>
          <FlexItem>
            <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
              Create TODO
            </Button>
          </FlexItem>
        </Flex>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Grid hasGutter>
          {/* Summary Cards */}
          <GridItem xl={4} lg={4} md={4} sm={12}>
            <Card className="dashboard__stats-card">
              <CardTitle>
                <Content component={ContentVariants.h3}>Total TODOs</Content>
              </CardTitle>
              <CardBody>
                <Content
                  component={ContentVariants.h1}
                  className="stat-number"
                  style={{ fontSize: "var(--pf-t--global--font--size--4xl)" }}
                >
                  {totalCount}
                </Content>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem xl={4} lg={4} md={4} sm={12}>
            <Card className="dashboard__stats-card">
              <CardTitle>
                <Content component={ContentVariants.h3}>Overdue TODOs</Content>
              </CardTitle>
              <CardBody>
                <Content
                  component={ContentVariants.h1}
                  className="stat-number"
                  style={{
                    fontSize: "var(--pf-t--global--font--size--4xl)",
                    color: "var(--pf-t--global--text--color--status--danger--default)"
                  }}
                >
                  {overdueCount}
                </Content>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem xl={4} lg={4} md={4} sm={12}>
            <Card className="dashboard__stats-card">
              <CardTitle>
                <Content component={ContentVariants.h3}>Completed Today</Content>
              </CardTitle>
              <CardBody>
                <Content
                  component={ContentVariants.h1}
                  className="stat-number"
                  style={{
                    fontSize: "var(--pf-t--global--font--size--4xl)",
                    color: "var(--pf-t--global--text--color--status--success--default)"
                  }}
                >
                  {completedTodayCount}
                </Content>
              </CardBody>
            </Card>
          </GridItem>

          {/* Overdue TODOs Section */}
          <GridItem xl={12} lg={12} md={12} sm={12}>
            <Card className="dashboard__overdue-section">
              <CardTitle>
                <Content component={ContentVariants.h2}>Overdue TODOs</Content>
              </CardTitle>
              <CardBody>
                {top5Overdue.length === 0 ? (
                  <Content>
                    <Content component="p">No overdue TODOs</Content>
                  </Content>
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
                                <Content>
                                  <Content component={ContentVariants.p}>
                                    <strong>{todo.title}</strong>
                                  </Content>
                                </Content>
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
                                <Content component="p">{todo.targetDate}</Content>
                              </DataListCell>
                            ]}
                          />
                        </DataListItemRow>
                      </DataListItem>
                    ))}
                  </DataList>
                )}
                <div style={{ marginTop: "var(--pf-t--global--spacer--md)" }}>
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
                <Content component={ContentVariants.h2}>Quick Create TODO</Content>
              </CardTitle>
              <CardBody>
                {!isQuickCreateExpanded ? (
                  <Button icon={<PlusCircleIcon />}
                    variant="secondary"
                    onClick={() => setIsQuickCreateExpanded(true)}
                  >
                     Expand to Create
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
