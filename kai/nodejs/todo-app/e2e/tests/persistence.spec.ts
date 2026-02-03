import { test, expect } from '@playwright/test';
import { TodoListPage } from '../page-objects/TodoListPage';
import { DashboardPage } from '../page-objects/DashboardPage';
import { LocalStorageHelper } from '../utils/localStorage';
import { createTestTodo } from '../fixtures/todos';

test.describe('Persistence', () => {
  let todoListPage: TodoListPage;
  let dashboardPage: DashboardPage;
  let storage: LocalStorageHelper;

  test.beforeEach(async ({ page }) => {
    todoListPage = new TodoListPage(page);
    dashboardPage = new DashboardPage(page);
    storage = new LocalStorageHelper(page);
  });

  test('should persist TODOs after page refresh', async ({ page }) => {
    const todos = [
      createTestTodo({ title: 'Persistent TODO 1' }),
      createTestTodo({ title: 'Persistent TODO 2' }),
    ];
    await storage.initializeWithData('/#/todos', todos);

    let titles = await todoListPage.getTodoTitles();
    expect(titles).toContain('Persistent TODO 1');
    expect(titles).toContain('Persistent TODO 2');

    await page.reload();

    titles = await todoListPage.getTodoTitles();
    expect(titles).toContain('Persistent TODO 1');
    expect(titles).toContain('Persistent TODO 2');
  });

  test('should persist TODOs after navigation', async () => {
    const todos = [createTestTodo({ title: 'Navigation TODO' })];
    await storage.initializeWithData('/#/todos', todos);

    let titles = await todoListPage.getTodoTitles();
    expect(titles).toContain('Navigation TODO');

    await todoListPage.clickDashboardLink();
    await dashboardPage.clickTodoListLink();

    titles = await todoListPage.getTodoTitles();
    expect(titles).toContain('Navigation TODO');
  });

  test('should load seed data on first visit', async ({ page }) => {
    // Don't set localStorage - let app load from JSON
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const todos = await storage.getTodos();
    expect(todos.length).toBeGreaterThan(0);
  });

  test('should not reload seed data if localStorage exists', async () => {
    const customTodo = createTestTodo({ title: 'Custom TODO' });
    await storage.initializeWithData('/', [customTodo]);

    const todos = await storage.getTodos();
    expect(todos.length).toBe(1);
    expect(todos[0].title).toBe('Custom TODO');
  });
});
