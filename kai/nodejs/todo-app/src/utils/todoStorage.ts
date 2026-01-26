import type { Todo } from '../types/todo';

const STORAGE_KEY = 'todos-data';

export const loadTodos = (): Todo[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading todos from localStorage:', error);
  }
  return [];
};

export const saveTodos = (todos: Todo[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Error saving todos to localStorage:', error);
  }
};

export const initializeFromJson = async (): Promise<Todo[]> => {
  // Check if localStorage has been initialized (key exists)
  const hasBeenInitialized = localStorage.getItem(STORAGE_KEY) !== null;

  if (hasBeenInitialized) {
    // Return existing data, even if empty array (user may have deleted all todos)
    return loadTodos();
  }

  // First time initialization - load from JSON file
  try {
    const response = await fetch('/data/todos.json');
    const data = await response.json();
    if (data.todos && Array.isArray(data.todos)) {
      saveTodos(data.todos);
      return data.todos;
    }
  } catch (error) {
    console.error('Error loading initial todos from JSON:', error);
  }

  return [];
};

export const createTodo = (todoData: Partial<Todo>): Todo => {
  const newTodo: Todo = {
    id: `todo-${Date.now()}`,
    title: todoData.title!,
    description: todoData.description,
    targetDate: todoData.targetDate,
    priority: todoData.priority,
    color: todoData.color,
    tags: todoData.tags || [],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const todos = loadTodos();
  todos.push(newTodo);
  saveTodos(todos);

  return newTodo;
};

export const updateTodo = (id: string, updates: Partial<Todo>): Todo | null => {
  const todos = loadTodos();
  const index = todos.findIndex(t => t.id === id);

  if (index === -1) return null;

  todos[index] = {
    ...todos[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  saveTodos(todos);
  return todos[index];
};

export const deleteTodo = (id: string): boolean => {
  const todos = loadTodos();
  const filtered = todos.filter(t => t.id !== id);

  if (filtered.length === todos.length) return false;

  saveTodos(filtered);
  return true;
};

export const archiveTodo = (id: string): Todo | null => {
  return updateTodo(id, { status: 'archived' });
};

export const getTodoById = (id: string): Todo | null => {
  const todos = loadTodos();
  return todos.find(t => t.id === id) || null;
};

export const getActiveTodos = (): Todo[] => {
  const todos = loadTodos();
  return todos.filter(t => t.status === 'active');
};

export const getArchivedTodos = (): Todo[] => {
  const todos = loadTodos();
  return todos.filter(t => t.status === 'archived');
};
