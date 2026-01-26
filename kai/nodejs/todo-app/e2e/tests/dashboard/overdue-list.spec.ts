import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../page-objects/DashboardPage';
import { LocalStorageHelper } from '../../utils/localStorage';
import { createTestTodo } from '../../fixtures/todos';
import { getPastDate } from '../../utils/test-helpers';

test.describe('Dashboard Overdue List', () => {
  let dashboardPage: DashboardPage;
  let storage: LocalStorageHelper;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    storage = new LocalStorageHelper(page);
  });

  test('should display top 5 overdue items', async () => {
    const overdueTodos = Array.from({ length: 7 }, (_, i) =>
      createTestTodo({
        title: `Overdue TODO ${i + 1}`,
        targetDate: getPastDate(i + 1),
        priority: 'high',
      })
    );

    await storage.initializeWithData('/', overdueTodos);

    const overdueItems = await dashboardPage.getOverdueItems();
    expect(overdueItems.length).toBe(5);
  });

  test('should show no overdue message when none exist', async () => {
    const todos = [createTestTodo({ title: 'Future TODO', targetDate: '12/31/2026' })];
    await storage.initializeWithData('/', todos);

    const hasNoOverdueMessage = await dashboardPage.hasNoOverdueMessage();
    expect(hasNoOverdueMessage).toBe(true);
  });

  test('should checkbox archives TODO', async ({ page }) => {
    const overdueTodo = createTestTodo({
      title: 'Overdue to Archive',
      targetDate: getPastDate(1),
    });

    await storage.initializeWithData('/', [overdueTodo]);

    await dashboardPage.markOverdueItemDone(0);
    await page.waitForTimeout(100);

    const hasNoOverdueMessage = await dashboardPage.hasNoOverdueMessage();
    expect(hasNoOverdueMessage).toBe(true);
  });

  test('should view all link navigates to todos page', async ({ page }) => {
    const overdueTodo = createTestTodo({
      title: 'Overdue TODO',
      targetDate: getPastDate(1),
    });

    await storage.initializeWithData('/', [overdueTodo]);

    await dashboardPage.clickViewAllTodos();
    await expect(page).toHaveURL(/\/#\/todos/);
  });
});
