import { test, expect } from '@playwright/test';
import { TodoListPage } from '../../page-objects/TodoListPage';
import { TodoModal } from '../../page-objects/TodoModal';
import { LocalStorageHelper } from '../../utils/localStorage';
import { testTodos, createTestTodo } from '../../fixtures/todos';

test.describe('CRUD Operations', () => {
  let todoListPage: TodoListPage;
  let todoModal: TodoModal;
  let storage: LocalStorageHelper;

  test.beforeEach(async ({ page }) => {
    todoListPage = new TodoListPage(page);
    todoModal = new TodoModal(page);
    storage = new LocalStorageHelper(page);
  });

  test.describe('Create', () => {
    test('should create TODO with only title', async () => {
      await storage.initializeWithData('/#/todos', []);
      await todoListPage.openCreateModal();

      await todoModal.createTodo({
        title: 'Simple TODO',
      });

      const titles = await todoListPage.getTodoTitles();
      expect(titles).toContain('Simple TODO');
    });

    test('should create TODO with all fields', async () => {
      await storage.initializeWithData('/#/todos', []);
      await todoListPage.openCreateModal();

      await todoModal.createTodo({
        title: 'Complete TODO',
        description: 'This is a complete TODO',
        targetDate: '12/31/2026',
        priority: 'high',
        color: 'blue',
        tags: 'work, important',
      });

      const titles = await todoListPage.getTodoTitles();
      expect(titles).toContain('Complete TODO');
    });

  });

  test.describe('Read', () => {
    test('should display all active TODOs', async () => {
      const activeTodos = testTodos.filter(t => t.status === 'active');
      await storage.initializeWithData('/#/todos', testTodos);

      const titles = await todoListPage.getTodoTitles();
      expect(titles.length).toBe(activeTodos.length);

      for (const todo of activeTodos) {
        expect(titles).toContain(todo.title);
      }
    });

    test('should not display archived TODOs', async () => {
      const archivedTodo = createTestTodo({ title: 'Archived TODO', status: 'archived' });
      await storage.initializeWithData('/#/todos', [archivedTodo]);

      const isEmpty = await todoListPage.isTableEmpty();
      expect(isEmpty).toBe(true);
    });
  });

  test.describe('Update', () => {
    test('should edit existing TODO updates title', async () => {
      const todo = createTestTodo({ title: 'Original Title' });
      await storage.initializeWithData('/#/todos', [todo]);

      await todoListPage.editTodo('Original Title');
      await todoModal.waitForModal();

      await todoModal.fillTitle('Updated Title');
      await todoModal.clickSave();

      const titles = await todoListPage.getTodoTitles();
      expect(titles).toContain('Updated Title');
      expect(titles).not.toContain('Original Title');
    });

    test('should preserve unchanged fields when editing', async () => {
      const todo = createTestTodo({
        title: 'Original Title',
        description: 'Original Description',
        priority: 'high',
      });
      await storage.initializeWithData('/#/todos', [todo]);

      await todoListPage.editTodo('Original Title');
      await todoModal.waitForModal();

      await todoModal.fillTitle('Updated Title');
      await todoModal.clickSave();

      const storedTodos = await storage.getTodos();
      const updatedTodo = storedTodos.find(t => t.title === 'Updated Title');

      expect(updatedTodo).toBeDefined();
      expect(updatedTodo?.description).toBe('Original Description');
      expect(updatedTodo?.priority).toBe('high');
    });
  });

});
