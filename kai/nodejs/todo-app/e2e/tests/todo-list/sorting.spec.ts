import { test, expect } from '@playwright/test';
import { TodoListPage } from '../../page-objects/TodoListPage';
import { LocalStorageHelper } from '../../utils/localStorage';
import { createTestTodo } from '../../fixtures/todos';

test.describe('Todo List Sorting', () => {
  let todoListPage: TodoListPage;
  let storage: LocalStorageHelper;

  test.beforeEach(async ({ page }) => {
    todoListPage = new TodoListPage(page);
    storage = new LocalStorageHelper(page);
  });

  test('should sort by title ascending and descending', async ({ page }) => {
    const todos = [
      createTestTodo({ title: 'Zebra' }),
      createTestTodo({ title: 'Apple' }),
      createTestTodo({ title: 'Mango' }),
    ];

    await storage.initializeWithData('/#/todos', todos);

    await todoListPage.sortByColumn('title', 'asc');
    let titles = await todoListPage.getTodoTitles();
    expect(titles).toEqual(['Apple', 'Mango', 'Zebra']);

    // Reload to reset sort state
    await page.reload();
    await todoListPage.sortByColumn('title', 'desc');
    titles = await todoListPage.getTodoTitles();
    expect(titles).toEqual(['Zebra', 'Mango', 'Apple']);
  });

  test('should sort by target date ascending and descending', async ({ page }) => {
    const todos = [
      createTestTodo({ title: 'Latest', targetDate: '12/31/2026' }),
      createTestTodo({ title: 'Earliest', targetDate: '01/01/2026' }),
      createTestTodo({ title: 'Middle', targetDate: '06/15/2026' }),
    ];

    await storage.initializeWithData('/#/todos', todos);

    await todoListPage.sortByColumn('date', 'asc');
    let titles = await todoListPage.getTodoTitles();
    expect(titles).toEqual(['Earliest', 'Middle', 'Latest']);

    // Reload to reset sort state
    await page.reload();
    await todoListPage.sortByColumn('date', 'desc');
    titles = await todoListPage.getTodoTitles();
    expect(titles).toEqual(['Latest', 'Middle', 'Earliest']);
  });
});
