import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../page-objects/DashboardPage';
import { LocalStorageHelper } from '../../utils/localStorage';

test.describe('Dashboard Quick Create', () => {
  let dashboardPage: DashboardPage;
  let storage: LocalStorageHelper;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    storage = new LocalStorageHelper(page);
  });

  test('should expand form shows input', async () => {
    await storage.initializeWithData('/', []);

    let isExpanded = await dashboardPage.isQuickCreateExpanded();
    expect(isExpanded).toBe(false);

    await dashboardPage.expandQuickCreate();

    isExpanded = await dashboardPage.isQuickCreateExpanded();
    expect(isExpanded).toBe(true);
  });

  test('should save creates TODO and collapses form', async ({ page }) => {
    await storage.initializeWithData('/', []);
    await dashboardPage.quickCreateTodo('Quick TODO');

    await page.waitForTimeout(100);

    const isExpanded = await dashboardPage.isQuickCreateExpanded();
    expect(isExpanded).toBe(false);

    const todos = await storage.getTodos();
    expect(todos.length).toBe(1);
    expect(todos[0].title).toBe('Quick TODO');
  });

  test('should cancel collapses without creating', async () => {
    await storage.initializeWithData('/', []);
    await dashboardPage.expandQuickCreate();
    await dashboardPage.quickTitleInput.fill('Cancelled TODO');
    await dashboardPage.cancelQuickCreate();

    const isExpanded = await dashboardPage.isQuickCreateExpanded();
    expect(isExpanded).toBe(false);

    const todos = await storage.getTodos();
    expect(todos.length).toBe(0);
  });
});
