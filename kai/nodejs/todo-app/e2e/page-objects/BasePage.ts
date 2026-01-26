import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async navigate(path: string) {
    const url = path.startsWith('/') ? `/#${path}` : `/#/${path}`;
    await this.page.goto(url);
  }

  async clickDashboardLink() {
    await this.page.getByRole('button', { name: 'Dashboard' }).click();
  }

  async clickTodoListLink() {
    await this.page.getByRole('button', { name: 'TODO List' }).click();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async waitForUrl(hash: string) {
    await this.page.waitForURL(`**/${hash}`);
  }

  async getPageTitle(): Promise<string> {
    const title = this.page.locator('h1').first();
    return await title.textContent() || '';
  }
}
