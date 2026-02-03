import { test, expect } from '@playwright/test';
import { TodoListPage } from '../../page-objects/TodoListPage';
import { DashboardPage } from '../../page-objects/DashboardPage';
import { LocalStorageHelper } from '../../utils/localStorage';
import { createTestTodo } from '../../fixtures/todos';

test.describe('Mark as Done', () => {
  let todoListPage: TodoListPage;
  let dashboardPage: DashboardPage;
  let storage: LocalStorageHelper;

  test.beforeEach(async ({ page }) => {
    todoListPage = new TodoListPage(page);
    dashboardPage = new DashboardPage(page);
    storage = new LocalStorageHelper(page);
  });

  test('should checkbox archives TODO and removes from list', async ({ page }) => {
    const todo = createTestTodo({ title: 'TODO to Complete' });
    await storage.initializeWithData('/#/todos', [todo]);

    let titles = await todoListPage.getTodoTitles();
    expect(titles).toContain('TODO to Complete');

    await todoListPage.markTodoAsDone('TODO to Complete');
    await page.waitForTimeout(100);

    // Verify status changed to archived
    const storedTodos = await storage.getTodos();
    const completedTodo = storedTodos.find(t => t.title === 'TODO to Complete');
    expect(completedTodo?.status).toBe('archived');

    // Verify removed from list
    titles = await todoListPage.getTodoTitles();
    expect(titles).not.toContain('TODO to Complete');
  });

  test('should completed today stat updates', async ({ page }) => {
    const todo = createTestTodo({ title: 'TODO to Complete' });
    await storage.initializeWithData('/#/todos', [todo]);

    await todoListPage.markTodoAsDone('TODO to Complete');
    await page.waitForTimeout(100);

    await todoListPage.clickDashboardLink();
    const stats = await dashboardPage.getStatistics();

    expect(stats.completedToday).toBe(1);
  });
});
