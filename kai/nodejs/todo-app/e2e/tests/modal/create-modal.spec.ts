import { test, expect } from '@playwright/test';
import { TodoListPage } from '../../page-objects/TodoListPage';
import { TodoModal } from '../../page-objects/TodoModal';
import { LocalStorageHelper } from '../../utils/localStorage';

test.describe('Create Modal', () => {
  let todoListPage: TodoListPage;
  let todoModal: TodoModal;
  let storage: LocalStorageHelper;

  test.beforeEach(async ({ page }) => {
    todoListPage = new TodoListPage(page);
    todoModal = new TodoModal(page);
    storage = new LocalStorageHelper(page);
  });

  test('should modal open with correct title', async () => {
    await storage.initializeWithData('/#/todos', []);
    await todoListPage.openCreateModal();

    const modalTitle = await todoModal.getModalTitle();
    expect(modalTitle).toContain('Create New TODO');
  });

  test('should title field validation works', async () => {
    await storage.initializeWithData('/#/todos', []);
    await todoListPage.openCreateModal();

    // Initially save button should be disabled (empty title)
    let isSaveDisabled = await todoModal.isSaveButtonDisabled();
    expect(isSaveDisabled).toBe(true);

    await todoModal.fillTitle('Valid Title');
    isSaveDisabled = await todoModal.isSaveButtonDisabled();
    expect(isSaveDisabled).toBe(false);

    await todoModal.fillTitle('');
    isSaveDisabled = await todoModal.isSaveButtonDisabled();
    expect(isSaveDisabled).toBe(true);
  });

  test('should accept valid date format MM/DD/YYYY', async () => {
    await storage.initializeWithData('/#/todos', []);
    await todoListPage.openCreateModal();

    await todoModal.fillTitle('Date Test');
    await todoModal.fillDate('12/31/2026');
    await todoModal.clickSave();

    const todos = await storage.getTodos();
    expect(todos[0].targetDate).toBe('12/31/2026');
  });

  test('should priority tile selection works', async () => {
    await storage.initializeWithData('/#/todos', []);
    await todoListPage.openCreateModal();

    await todoModal.fillTitle('Priority Test');
    await todoModal.selectPriority('high');
    await todoModal.clickSave();

    const todos = await storage.getTodos();
    expect(todos[0].priority).toBe('high');
  });

  test('should color tile selection works', async () => {
    await storage.initializeWithData('/#/todos', []);
    await todoListPage.openCreateModal();

    await todoModal.fillTitle('Color Test');
    await todoModal.selectColor('blue');
    await todoModal.clickSave();

    const todos = await storage.getTodos();
    expect(todos[0].color).toBe('blue');
  });

  test('should tags parsing works (comma-separated)', async () => {
    await storage.initializeWithData('/#/todos', []);
    await todoListPage.openCreateModal();

    await todoModal.fillTitle('Tags Test');
    await todoModal.fillTags('work, urgent, review');
    await todoModal.clickSave();

    const todos = await storage.getTodos();
    expect(todos[0].tags).toEqual(['work', 'urgent', 'review']);
  });

  test('should reset button clears all fields', async () => {
    await storage.initializeWithData('/#/todos', []);
    await todoListPage.openCreateModal();

    await todoModal.fillTitle('Reset Test');
    await todoModal.fillDescription('Test Description');
    await todoModal.fillTags('tag1, tag2');
    await todoModal.clickReset();

    expect(await todoModal.getTitle()).toBe('');
    expect(await todoModal.getDescription()).toBe('');
    expect(await todoModal.getTags()).toBe('');
  });
});
