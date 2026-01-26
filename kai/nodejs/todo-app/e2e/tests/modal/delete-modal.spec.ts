import { test, expect } from '@playwright/test';
import { TodoListPage } from '../../page-objects/TodoListPage';
import { DeleteModal } from '../../page-objects/DeleteModal';
import { LocalStorageHelper } from '../../utils/localStorage';
import { createTestTodo } from '../../fixtures/todos';

test.describe('Delete Modal', () => {
  let todoListPage: TodoListPage;
  let deleteModal: DeleteModal;
  let storage: LocalStorageHelper;

  test.beforeEach(async ({ page }) => {
    todoListPage = new TodoListPage(page);
    deleteModal = new DeleteModal(page);
    storage = new LocalStorageHelper(page);
  });

  test('should modal show TODO title', async () => {
    const todo = createTestTodo({ title: 'TODO to Delete' });
    await storage.initializeWithData('/#/todos', [todo]);

    await todoListPage.deleteTodo('TODO to Delete');
    await deleteModal.waitForModal();

    const todoTitle = await deleteModal.getTodoTitle();
    expect(todoTitle).toBe('TODO to Delete');
  });

  test('should delete button remove TODO permanently', async () => {
    const todo = createTestTodo({ title: 'TODO to Delete' });
    await storage.initializeWithData('/#/todos', [todo]);

    await todoListPage.deleteTodo('TODO to Delete');
    await deleteModal.waitForModal();
    await deleteModal.confirmDelete();

    const todos = await storage.getTodos();
    expect(todos.length).toBe(0);
  });

  test('should cancel button close without deleting', async () => {
    const todo = createTestTodo({ title: 'TODO to Keep' });
    await storage.initializeWithData('/#/todos', [todo]);

    await todoListPage.deleteTodo('TODO to Keep');
    await deleteModal.waitForModal();
    await deleteModal.cancelDelete();

    const todos = await storage.getTodos();
    expect(todos.length).toBe(1);
    expect(todos[0].title).toBe('TODO to Keep');
  });
});
