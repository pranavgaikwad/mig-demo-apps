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

  test('should sort by title ascending', async () => {
    const todos = [
      createTestTodo({ title: 'Zebra' }),
      createTestTodo({ title: 'Apple' }),
      createTestTodo({ title: 'Mango' }),
    ];

    await storage.initializeWithData('/#/todos', todos);

    await todoListPage.sortByColumn('title', 'asc');
    const titles = await todoListPage.getTodoTitles();

    expect(titles).toEqual(['Apple', 'Mango', 'Zebra']);
  });

  test('should sort by title descending', async () => {
    const todos = [
      createTestTodo({ title: 'Zebra' }),
      createTestTodo({ title: 'Apple' }),
      createTestTodo({ title: 'Mango' }),
    ];

    await storage.initializeWithData('/#/todos', todos);

    await todoListPage.sortByColumn('title', 'desc');
    const titles = await todoListPage.getTodoTitles();

    expect(titles).toEqual(['Zebra', 'Mango', 'Apple']);
  });

  test('should sort by target date ascending', async () => {
    const todos = [
      createTestTodo({ title: 'Latest', targetDate: '12/31/2026' }),
      createTestTodo({ title: 'Earliest', targetDate: '01/01/2026' }),
      createTestTodo({ title: 'Middle', targetDate: '06/15/2026' }),
    ];

    await storage.initializeWithData('/#/todos', todos);

    await todoListPage.sortByColumn('date', 'asc');
    const titles = await todoListPage.getTodoTitles();

    expect(titles).toEqual(['Earliest', 'Middle', 'Latest']);
  });

  test('should sort by target date descending', async () => {
    const todos = [
      createTestTodo({ title: 'Latest', targetDate: '12/31/2026' }),
      createTestTodo({ title: 'Earliest', targetDate: '01/01/2026' }),
      createTestTodo({ title: 'Middle', targetDate: '06/15/2026' }),
    ];

    await storage.initializeWithData('/#/todos', todos);

    await todoListPage.sortByColumn('date', 'desc');
    const titles = await todoListPage.getTodoTitles();

    expect(titles).toEqual(['Latest', 'Middle', 'Earliest']);
  });
});
