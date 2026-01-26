import { test, expect } from '@playwright/test';
import { DashboardPage } from '../page-objects/DashboardPage';
import { TodoListPage } from '../page-objects/TodoListPage';
import { LocalStorageHelper } from '../utils/localStorage';

test.describe('Navigation', () => {
  let dashboardPage: DashboardPage;
  let todoListPage: TodoListPage;
  let storage: LocalStorageHelper;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    todoListPage = new TodoListPage(page);
    storage = new LocalStorageHelper(page);
  });

  test('should navigate from Dashboard to TodoList', async ({ page }) => {
    await storage.initializeWithData('/', []);
    await dashboardPage.clickTodoListLink();
    await expect(page).toHaveURL(/\/#\/todos/);
    await expect(page.getByRole('heading', { name: 'TODO List', level: 1 })).toBeVisible();
  });

  test('should navigate from TodoList to Dashboard', async ({ page }) => {
    await storage.initializeWithData('/#/todos', []);
    await todoListPage.clickDashboardLink();
    await expect(page).toHaveURL(/\/#\//);
    await expect(page.getByRole('heading', { name: 'TODO Dashboard', level: 1 })).toBeVisible();
  });

  test('should support direct URL navigation with hash router', async ({ page }) => {
    await storage.initializeWithData('/#/todos', []);
    await expect(page.getByRole('heading', { name: 'TODO List', level: 1 })).toBeVisible();

    await storage.initializeWithData('/#/', []);
    await expect(page.getByRole('heading', { name: 'TODO Dashboard', level: 1 })).toBeVisible();
  });

  test('should redirect unknown routes to Dashboard', async ({ page }) => {
    await storage.initializeWithData('/#/unknown-route', []);
    await expect(page).toHaveURL(/\/#\//);
  });
});
