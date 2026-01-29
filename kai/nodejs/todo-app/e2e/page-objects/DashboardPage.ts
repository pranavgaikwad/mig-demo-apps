import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface DashboardStats {
  total: number;
  overdue: number;
  completedToday: number;
}

export interface OverdueItem {
  title: string;
  priority?: string;
  color?: string;
  date?: string;
}

export class DashboardPage extends BasePage {
  readonly createButton: Locator;
  readonly quickCreateExpandButton: Locator;
  readonly quickTitleInput: Locator;
  readonly quickSaveButton: Locator;
  readonly quickCancelButton: Locator;
  readonly viewAllButton: Locator;

  constructor(page: Page) {
    super(page);
    this.createButton = page.getByRole('button', { name: 'Create TODO' });
    this.quickCreateExpandButton = page.getByRole('button', { name: /Expand to Create/i });
    this.quickTitleInput = page.locator('#quick-title');
    this.quickSaveButton = page.getByRole('button', { name: 'Save', exact: true });
    this.quickCancelButton = page.getByRole('button', { name: 'Cancel', exact: true });
    this.viewAllButton = page.getByRole('button', { name: 'View All TODOs' });
  }

  async open() {
    await this.navigate('/');
    await this.page.waitForLoadState('networkidle');
    await this.page.locator('h1:has-text("Dashboard")').waitFor({ state: 'visible', timeout: 10000 });
    // Wait for stats to be rendered
    await this.page.waitForTimeout(500);
  }

  async getStatistics(): Promise<DashboardStats> {
    // Wait for stats cards to be visible
    await this.page.locator('.dashboard__stats-card').first().waitFor({ state: 'visible', timeout: 10000 });

    // Wait for stats to be populated (not just "0")
    await this.page.waitForFunction(
      () => {
        const statNumbers = document.querySelectorAll('.dashboard__stats-card .stat-number');
        if (statNumbers.length < 3) return false;
        // Check that at least one stat element has text content
        return Array.from(statNumbers).every(el => el.textContent !== null);
      },
      {},
      { timeout: 10000 }
    );

    const statsCards = await this.page.locator('.dashboard__stats-card .stat-number').all();

    const total = parseInt(await statsCards[0].textContent() || '0');
    const overdue = parseInt(await statsCards[1].textContent() || '0');
    const completedToday = parseInt(await statsCards[2].textContent() || '0');

    return { total, overdue, completedToday };
  }

  async openCreateModal() {
    await this.createButton.click();
  }

  async expandQuickCreate() {
    // Check if already expanded by checking if title input is visible
    const isExpanded = await this.quickTitleInput.isVisible().catch(() => false);
    if (!isExpanded) {
      await this.quickCreateExpandButton.waitFor({ state: 'visible', timeout: 5000 });
      await this.quickCreateExpandButton.click();
    }
  }

  async quickCreateTodo(title: string) {
    await this.expandQuickCreate();
    await this.quickTitleInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.quickTitleInput.fill(title);
    await this.quickSaveButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.quickSaveButton.click();
    // Wait for form to collapse after save
    await this.quickTitleInput.waitFor({ state: 'hidden', timeout: 5000 });
  }

  async cancelQuickCreate() {
    await this.quickCancelButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.quickCancelButton.click();
  }

  async getOverdueItems(): Promise<OverdueItem[]> {
    // Wait for overdue section to load
    await this.page.waitForTimeout(500);
    const items = await this.page.locator('.overdue-todo-item').all();

    const overdueItems: OverdueItem[] = [];
    for (const item of items) {
      const title = await item.locator('strong').textContent() || '';
      const priorityLabel = item.locator('.pf-v6-c-label').first();
      const priority = await priorityLabel.isVisible()
        ? await priorityLabel.textContent()
        : undefined;

      overdueItems.push({
        title: title.trim(),
        priority: priority?.toLowerCase(),
      });
    }

    return overdueItems;
  }

  async markOverdueItemDone(index: number) {
    // Wait for overdue items to be visible
    await this.page.locator('.overdue-todo-item').first().waitFor({ state: 'visible', timeout: 10000 });

    const items = await this.page.locator('.overdue-todo-item').all();
    if (index >= items.length) {
      throw new Error(`Overdue item at index ${index} does not exist`);
    }

    const checkbox = items[index].locator('input[type="checkbox"]');
    await checkbox.waitFor({ state: 'visible', timeout: 5000 });
    await checkbox.click({ force: true, noWaitAfter: true });
    // Wait for the UI to update after clicking
    await this.page.waitForTimeout(500);
  }

  async hasNoOverdueMessage(): Promise<boolean> {
    return await this.page.locator('text=No overdue TODOs').isVisible();
  }

  async clickViewAllTodos() {
    await this.viewAllButton.click();
  }

  async isQuickCreateExpanded(): Promise<boolean> {
    return await this.quickTitleInput.isVisible();
  }
}
