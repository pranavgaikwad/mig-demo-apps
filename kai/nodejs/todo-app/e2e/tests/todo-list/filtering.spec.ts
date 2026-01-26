import { test, expect } from '@playwright/test';
import { TodoListPage } from '../../page-objects/TodoListPage';
import { LocalStorageHelper } from '../../utils/localStorage';
import { createTestTodo } from '../../fixtures/todos';
import { getPastDate } from '../../utils/test-helpers';

test.describe('Todo List Filtering', () => {
  let todoListPage: TodoListPage;
  let storage: LocalStorageHelper;

  test.beforeEach(async ({ page }) => {
    todoListPage = new TodoListPage(page);
    storage = new LocalStorageHelper(page);
  });

  test('should filter by priority - High', async () => {
    const todos = [
      createTestTodo({ title: 'High Priority', priority: 'high' }),
      createTestTodo({ title: 'Medium Priority', priority: 'medium' }),
      createTestTodo({ title: 'Low Priority', priority: 'low' }),
    ];

    await storage.initializeWithData('/#/todos', todos);

    await todoListPage.filterByPriority('high');
    const titles = await todoListPage.getTodoTitles();

    expect(titles).toContain('High Priority');
    expect(titles).not.toContain('Medium Priority');
    expect(titles).not.toContain('Low Priority');
  });

  test('should filter by priority - Medium', async () => {
    const todos = [
      createTestTodo({ title: 'High Priority', priority: 'high' }),
      createTestTodo({ title: 'Medium Priority', priority: 'medium' }),
      createTestTodo({ title: 'Low Priority', priority: 'low' }),
    ];

    await storage.initializeWithData('/#/todos', todos);

    await todoListPage.filterByPriority('medium');
    const titles = await todoListPage.getTodoTitles();

    expect(titles).toContain('Medium Priority');
    expect(titles).not.toContain('High Priority');
    expect(titles).not.toContain('Low Priority');
  });

  test('should filter by color', async () => {
    const todos = [
      createTestTodo({ title: 'Red TODO', color: 'red' }),
      createTestTodo({ title: 'Blue TODO', color: 'blue' }),
      createTestTodo({ title: 'Green TODO', color: 'green' }),
    ];

    await storage.initializeWithData('/#/todos', todos);

    await todoListPage.filterByColor('blue');
    const titles = await todoListPage.getTodoTitles();

    expect(titles).toContain('Blue TODO');
    expect(titles).not.toContain('Red TODO');
    expect(titles).not.toContain('Green TODO');
  });

  test('should filter by overdue status', async () => {
    const todos = [
      createTestTodo({ title: 'Overdue TODO', targetDate: getPastDate(2) }),
      createTestTodo({ title: 'Future TODO', targetDate: '12/31/2026' }),
    ];

    await storage.initializeWithData('/#/todos', todos);

    await todoListPage.toggleOverdueFilter();
    const titles = await todoListPage.getTodoTitles();

    expect(titles).toContain('Overdue TODO');
    expect(titles).not.toContain('Future TODO');
  });

  test('should combine multiple filters (AND logic)', async () => {
    const todos = [
      createTestTodo({
        title: 'Match All Filters',
        priority: 'high',
        color: 'red',
        targetDate: getPastDate(1),
      }),
      createTestTodo({
        title: 'Match Some Filters',
        priority: 'high',
        color: 'blue',
        targetDate: getPastDate(1),
      }),
      createTestTodo({
        title: 'Match No Filters',
        priority: 'low',
        color: 'green',
        targetDate: '12/31/2026',
      }),
    ];

    await storage.initializeWithData('/#/todos', todos);

    await todoListPage.filterByPriority('high');
    await todoListPage.filterByColor('red');
    await todoListPage.toggleOverdueFilter();

    const titles = await todoListPage.getTodoTitles();

    expect(titles).toContain('Match All Filters');
    expect(titles).not.toContain('Match Some Filters');
    expect(titles).not.toContain('Match No Filters');
  });

  test('should clear all filters', async () => {
    const todos = [
      createTestTodo({ title: 'High Priority', priority: 'high' }),
      createTestTodo({ title: 'Medium Priority', priority: 'medium' }),
    ];

    await storage.initializeWithData('/#/todos', todos);

    await todoListPage.filterByPriority('high');
    let titles = await todoListPage.getTodoTitles();
    expect(titles.length).toBe(1);

    await todoListPage.clearFilters();
    titles = await todoListPage.getTodoTitles();
    expect(titles.length).toBe(2);
  });

  test('should show empty state when no matches', async () => {
    const todos = [createTestTodo({ title: 'Low Priority', priority: 'low' })];

    await storage.initializeWithData('/#/todos', todos);

    await todoListPage.filterByPriority('high');

    const isEmpty = await todoListPage.isTableEmpty();
    expect(isEmpty).toBe(true);
  });
});
