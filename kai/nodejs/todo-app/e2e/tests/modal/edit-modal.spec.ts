import { test, expect } from '@playwright/test';
import { TodoListPage } from '../../page-objects/TodoListPage';
import { TodoModal } from '../../page-objects/TodoModal';
import { LocalStorageHelper } from '../../utils/localStorage';
import { createTestTodo } from '../../fixtures/todos';

test.describe('Edit Modal', () => {
  let todoListPage: TodoListPage;
  let todoModal: TodoModal;
  let storage: LocalStorageHelper;

  test.beforeEach(async ({ page }) => {
    todoListPage = new TodoListPage(page);
    todoModal = new TodoModal(page);
    storage = new LocalStorageHelper(page);
  });

  test('should modal pre-populate with TODO data', async () => {
    const todo = createTestTodo({
      title: 'Edit Test',
      description: 'Description to edit',
      priority: 'high',
      tags: ['tag1', 'tag2'],
    });

    await storage.initializeWithData('/#/todos', [todo]);
    await todoListPage.editTodo('Edit Test');

    expect(await todoModal.getTitle()).toBe('Edit Test');
    expect(await todoModal.getDescription()).toBe('Description to edit');
    expect(await todoModal.getTags()).toBe('tag1, tag2');
  });

  test('should modal title show Edit TODO', async () => {
    const todo = createTestTodo({ title: 'Edit Test' });
    await storage.initializeWithData('/#/todos', [todo]);
    await todoListPage.editTodo('Edit Test');

    const modalTitle = await todoModal.getModalTitle();
    expect(modalTitle).toContain('Edit TODO');
  });

  test('should update button saves changes', async () => {
    const todo = createTestTodo({ title: 'Original Title' });
    await storage.initializeWithData('/#/todos', [todo]);
    await todoListPage.editTodo('Original Title');

    await todoModal.fillTitle('Updated Title');
    await todoModal.clickSave();

    const todos = await storage.getTodos();
    expect(todos[0].title).toBe('Updated Title');
  });

  test('should tags display as comma-separated string', async () => {
    const todo = createTestTodo({
      title: 'Tags Test',
      tags: ['work', 'urgent', 'important'],
    });

    await storage.initializeWithData('/#/todos', [todo]);
    await todoListPage.editTodo('Tags Test');

    const tags = await todoModal.getTags();
    expect(tags).toBe('work, urgent, important');
  });

  test('should cancel discard changes', async () => {
    const todo = createTestTodo({ title: 'Original Title' });
    await storage.initializeWithData('/#/todos', [todo]);
    await todoListPage.editTodo('Original Title');

    await todoModal.fillTitle('Changed Title');
    await todoModal.clickCancel();

    const todos = await storage.getTodos();
    expect(todos[0].title).toBe('Original Title');
  });
});
