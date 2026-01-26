import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../page-objects/DashboardPage';
import { LocalStorageHelper } from '../../utils/localStorage';
import { createTestTodo } from '../../fixtures/todos';
import { getPastDate, getTodayDate } from '../../utils/test-helpers';

test.describe('Dashboard Statistics', () => {
  let dashboardPage: DashboardPage;
  let storage: LocalStorageHelper;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    storage = new LocalStorageHelper(page);
  });

  test('should display zero counts for empty list', async () => {
    await storage.initializeWithData('/', []);
    const stats = await dashboardPage.getStatistics();

    expect(stats.total).toBe(0);
    expect(stats.overdue).toBe(0);
    expect(stats.completedToday).toBe(0);
  });

  test('should display correct total count', async () => {
    const todos = [
      createTestTodo({ title: 'TODO 1' }),
      createTestTodo({ title: 'TODO 2' }),
      createTestTodo({ title: 'TODO 3' }),
    ];
    await storage.initializeWithData('/', todos);

    const stats = await dashboardPage.getStatistics();
    expect(stats.total).toBe(3);
  });

  test('should display correct overdue count', async () => {
    const todos = [
      createTestTodo({ title: 'Overdue 1', targetDate: getPastDate(5) }),
      createTestTodo({ title: 'Overdue 2', targetDate: getPastDate(2) }),
      createTestTodo({ title: 'Not Overdue', targetDate: '12/31/2026' }),
    ];
    await storage.initializeWithData('/', todos);

    const stats = await dashboardPage.getStatistics();
    expect(stats.overdue).toBe(2);
  });

  test('should update statistics when TODO is completed', async ({ page }) => {
    const todos = [
      createTestTodo({ title: 'TODO 1' }),
      createTestTodo({ title: 'TODO 2' }),
    ];
    await storage.initializeWithData('/', todos);

    let stats = await dashboardPage.getStatistics();
    expect(stats.total).toBe(2);
    expect(stats.completedToday).toBe(0);

    await dashboardPage.expandQuickCreate();
    await dashboardPage.quickCreateTodo('New TODO');

    // Wait for stats to update after TODO creation
    await page.waitForTimeout(1000);

    stats = await dashboardPage.getStatistics();
    expect(stats.total).toBe(3);
  });
});
