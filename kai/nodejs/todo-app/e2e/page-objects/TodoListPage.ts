import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class TodoListPage extends BasePage {
  readonly createButton: Locator;
  readonly priorityDropdown: Locator;
  readonly colorDropdown: Locator;
  readonly overdueSwitch: Locator;
  readonly clearFiltersButton: Locator;
  readonly table: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    super(page);
    this.createButton = page.getByRole('button', { name: 'Create TODO' });
    this.priorityDropdown = page.getByRole('button', { name: /Priority:/ });
    this.colorDropdown = page.getByRole('button', { name: /Color:/ });
    this.overdueSwitch = page.locator('#show-overdue-toggle');
    // Clear button is the last button in the filter flex container
    this.clearFiltersButton = page.locator('.pf-v6-l-flex').filter({ has: page.locator('#show-overdue-toggle') }).locator('button').last();
    this.table = page.locator('table[aria-label="TODO list"]');
    this.emptyState = page.locator('text=No todos found');
  }

  async open() {
    await this.navigate('/todos');
    await this.page.waitForLoadState('networkidle');
    await this.page.locator('h1:has-text("TODO List")').waitFor({ state: 'visible', timeout: 10000 });
    // Wait for either table or empty state to be visible
    await Promise.race([
      this.table.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}),
      this.emptyState.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {})
    ]);
  }

  async openCreateModal() {
    await this.createButton.click();
  }

  async filterByPriority(priority: 'all' | 'high' | 'medium' | 'low') {
    await this.priorityDropdown.waitFor({ state: 'visible', timeout: 10000 });
    await this.priorityDropdown.click();
    const menuItem = this.page.getByRole('menuitem', { name: new RegExp(priority, 'i') });
    await menuItem.waitFor({ state: 'visible', timeout: 5000 });
    await menuItem.click();
    // Wait for dropdown to close
    await this.page.getByRole('menu').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    // Wait for page to finish rerendering after filter
    await this.page.waitForTimeout(500);
  }

  async filterByColor(color: 'all' | 'red' | 'orange' | 'blue' | 'green' | 'purple' | 'gray') {
    await this.colorDropdown.waitFor({ state: 'visible', timeout: 10000 });
    await this.colorDropdown.click();
    const menuItem = this.page.getByRole('menuitem', { name: new RegExp(color, 'i') });
    await menuItem.waitFor({ state: 'visible', timeout: 5000 });
    await menuItem.click();
    // Wait for dropdown to close
    await this.page.getByRole('menu').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    // Wait for page to finish rerendering after filter
    await this.page.waitForTimeout(500);
  }

  async toggleOverdueFilter() {
    await this.overdueSwitch.waitFor({ state: 'visible', timeout: 10000 });
    await this.overdueSwitch.waitFor({ state: 'attached', timeout: 10000 });
    await this.overdueSwitch.click({ force: true });
    // Wait for page to finish rerendering after filter
    await this.page.waitForTimeout(500);
  }

  async clearFilters() {
    await this.clearFiltersButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.clearFiltersButton.click();
    // Wait for page to finish rerendering after clearing filters
    await this.page.waitForTimeout(1000);
  }

  async sortByColumn(columnName: 'title' | 'date', direction: 'asc' | 'desc') {
    const columnMap = {
      title: 'Title',
      date: 'Target Date',
    };

    const columnHeader = this.page.getByRole('columnheader', { name: columnMap[columnName] });
    await columnHeader.waitFor({ state: 'visible', timeout: 10000 });

    const sortButton = columnHeader.getByRole('button');
    await sortButton.waitFor({ state: 'visible', timeout: 5000 });
    await sortButton.click();
    // Wait for table to rerender after first sort
    await this.page.waitForTimeout(500);

    if (direction === 'desc') {
      await sortButton.click();
      // Wait for table to rerender after second sort
      await this.page.waitForTimeout(500);
    }
  }

  async getTodoTitles(): Promise<string[]> {
    // Wait for either table or empty state
    await Promise.race([
      this.table.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}),
      this.emptyState.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {})
    ]);

    const isTableVisible = await this.table.isVisible().catch(() => false);
    if (!isTableVisible) {
      return [];
    }

    const rows = await this.table.locator('tbody tr').all();
    const titles: string[] = [];

    for (const row of rows) {
      const titleCell = row.locator('td').nth(1);
      const title = await titleCell.textContent();
      if (title) {
        titles.push(title.trim());
      }
    }

    return titles;
  }

  async waitForTableToLoad(expectedMinRows: number = 1): Promise<void> {
    // Wait for table to be visible
    await this.table.waitFor({ state: 'visible', timeout: 10000 });

    // Wait for table to have at least the expected number of rows
    await this.page.waitForFunction(
      ({ tableSelector, minRows }) => {
        const table = document.querySelector(tableSelector);
        if (!table) return false;
        const rows = table.querySelectorAll('tbody tr');
        return rows.length >= minRows;
      },
      { tableSelector: 'table[aria-label="TODO list"]', minRows: expectedMinRows },
      { timeout: 10000 }
    );

    // Additional wait for React to finish rendering
    await this.page.waitForTimeout(500);
  }

  async getTodoByTitle(title: string): Promise<Locator | null> {
    // Ensure we're on the todos page
    await this.page.waitForURL(/.*#\/todos/, { timeout: 10000 });

    // Wait for page heading to confirm we're on the right page
    await this.page.locator('h1:has-text("TODO List")').waitFor({ state: 'visible', timeout: 10000 });

    // Wait for table to load with at least 1 row
    try {
      await this.waitForTableToLoad(1);
    } catch (e) {
      // Table might be empty
      return null;
    }

    // Wait for the specific row to appear
    try {
      await this.page.waitForSelector(`text="${title}"`, { timeout: 10000 });
    } catch (e) {
      // Row might not exist, that's ok
      return null;
    }

    const rows = await this.table.locator('tbody tr').all();

    for (const row of rows) {
      const titleCell = row.locator('td').nth(1);
      const cellText = await titleCell.textContent();

      if (cellText?.trim() === title) {
        return row;
      }
    }

    return null;
  }

  async editTodo(title: string) {
    const row = await this.getTodoByTitle(title);
    if (!row) {
      throw new Error(`TODO with title "${title}" not found`);
    }

    const actionCell = row.locator('td').last();
    const editButton = actionCell.locator('button').first();
    await editButton.waitFor({ state: 'visible', timeout: 5000 });
    await editButton.click();
  }

  async deleteTodo(title: string) {
    const row = await this.getTodoByTitle(title);
    if (!row) {
      throw new Error(`TODO with title "${title}" not found`);
    }

    const actionCell = row.locator('td').last();
    const deleteButton = actionCell.locator('button').nth(1);
    await deleteButton.waitFor({ state: 'visible', timeout: 5000 });
    await deleteButton.click();
  }

  async markTodoAsDone(title: string) {
    const row = await this.getTodoByTitle(title);
    if (!row) {
      throw new Error(`TODO with title "${title}" not found`);
    }

    const checkbox = row.locator('input[type="checkbox"]');
    await checkbox.waitFor({ state: 'visible', timeout: 5000 });
    await checkbox.click({ force: true, noWaitAfter: true });
    // Wait for the UI to update after clicking
    await this.page.waitForTimeout(500);
  }

  async isTableEmpty(): Promise<boolean> {
    return await this.emptyState.isVisible();
  }

  async getTodoCount(): Promise<number> {
    const isTableVisible = await this.table.isVisible().catch(() => false);
    if (!isTableVisible) {
      return 0;
    }

    return await this.table.locator('tbody tr').count();
  }
}
