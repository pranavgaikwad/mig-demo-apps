import { Todo } from '../utils/localStorage';
import { getPastDate, getFutureDate, getISOTimestamp, generateTodoId } from '../utils/test-helpers';

export const minimalTodo: Todo = {
  id: generateTodoId(),
  title: 'Minimal TODO',
  tags: [],
  status: 'active',
  createdAt: getISOTimestamp(),
  updatedAt: getISOTimestamp(),
};

export const fullTodo: Todo = {
  id: generateTodoId(),
  title: 'Full Featured TODO',
  description: 'This is a complete TODO with all fields populated',
  targetDate: getFutureDate(7),
  priority: 'high',
  color: 'blue',
  tags: ['work', 'important', 'project'],
  status: 'active',
  createdAt: getISOTimestamp(),
  updatedAt: getISOTimestamp(),
};

export const testTodos: Todo[] = [
  {
    id: 'test-todo-1',
    title: 'Active TODO - High Priority',
    description: 'This is an active todo with high priority',
    targetDate: getFutureDate(5),
    priority: 'high',
    color: 'red',
    tags: ['urgent', 'work'],
    status: 'active',
    createdAt: getISOTimestamp(new Date(Date.now() - 86400000 * 3)),
    updatedAt: getISOTimestamp(new Date(Date.now() - 86400000 * 3)),
  },
  {
    id: 'test-todo-2',
    title: 'Overdue TODO - Medium Priority',
    description: 'This todo is overdue',
    targetDate: getPastDate(2),
    priority: 'medium',
    color: 'orange',
    tags: ['overdue'],
    status: 'active',
    createdAt: getISOTimestamp(new Date(Date.now() - 86400000 * 7)),
    updatedAt: getISOTimestamp(new Date(Date.now() - 86400000 * 7)),
  },
  {
    id: 'test-todo-3',
    title: 'Active TODO - Low Priority',
    description: 'This is a low priority task',
    targetDate: getFutureDate(10),
    priority: 'low',
    color: 'green',
    tags: ['someday'],
    status: 'active',
    createdAt: getISOTimestamp(new Date(Date.now() - 86400000 * 1)),
    updatedAt: getISOTimestamp(new Date(Date.now() - 86400000 * 1)),
  },
  {
    id: 'test-todo-4',
    title: 'Archived TODO',
    description: 'This todo has been completed',
    targetDate: getPastDate(1),
    priority: 'high',
    color: 'blue',
    tags: ['done'],
    status: 'archived',
    createdAt: getISOTimestamp(new Date(Date.now() - 86400000 * 5)),
    updatedAt: getISOTimestamp(),
  },
  {
    id: 'test-todo-5',
    title: 'Overdue TODO - High Priority',
    description: 'Another overdue high priority item',
    targetDate: getPastDate(5),
    priority: 'high',
    color: 'red',
    tags: ['critical', 'overdue'],
    status: 'active',
    createdAt: getISOTimestamp(new Date(Date.now() - 86400000 * 10)),
    updatedAt: getISOTimestamp(new Date(Date.now() - 86400000 * 10)),
  },
];

export function createTestTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: generateTodoId(),
    title: 'Test TODO',
    tags: [],
    status: 'active',
    createdAt: getISOTimestamp(),
    updatedAt: getISOTimestamp(),
    ...overrides,
  };
}
