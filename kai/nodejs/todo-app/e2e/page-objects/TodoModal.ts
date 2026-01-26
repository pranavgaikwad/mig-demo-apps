import { Page, Locator } from '@playwright/test';

export interface TodoData {
  title: string;
  description?: string;
  targetDate?: string;
  priority?: 'high' | 'medium' | 'low';
  color?: 'red' | 'orange' | 'blue' | 'green' | 'purple' | 'gray';
  tags?: string;
}

export class TodoModal {
  readonly modal: Locator;
  readonly modalTitle: Locator;
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly dateInput: Locator;
  readonly tagsInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly resetButton: Locator;

  constructor(private page: Page) {
    this.modal = page.locator('.pf-v5-c-modal-box');
    this.modalTitle = page.locator('[data-test-id="modal-title"]');
    this.titleInput = page.locator('#todo-title');
    this.descriptionInput = page.locator('#todo-description');
    this.dateInput = page.locator('.pf-v5-c-date-picker input').first();
    this.tagsInput = page.locator('#todo-tags');
    this.saveButton = page.getByRole('button', { name: /^(Create|Update)$/i });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
  }

  async waitForModal() {
    await this.modal.waitFor({ state: 'visible' });
  }

  async isOpen(): Promise<boolean> {
    return await this.modal.isVisible();
  }

  async getModalTitle(): Promise<string> {
    return await this.modalTitle.textContent() || '';
  }

  async fillTitle(title: string) {
    await this.titleInput.fill(title);
  }

  async fillDescription(description: string) {
    await this.descriptionInput.fill(description);
  }

  async fillDate(date: string) {
    await this.dateInput.fill(date);
  }

  async selectPriority(priority: 'high' | 'medium' | 'low') {
    const priorityTile = this.page.locator(`[data-test="priority-${priority}"]`);
    await priorityTile.click();
  }

  async selectColor(color: 'red' | 'orange' | 'blue' | 'green' | 'purple' | 'gray') {
    const colorTile = this.page.locator(`[data-test="color-${color}"]`);
    await colorTile.click();
  }

  async fillTags(tags: string) {
    await this.tagsInput.fill(tags);
  }

  async createTodo(data: TodoData) {
    await this.waitForModal();
    await this.fillTitle(data.title);

    if (data.description) {
      await this.fillDescription(data.description);
    }

    if (data.targetDate) {
      await this.fillDate(data.targetDate);
    }

    if (data.priority) {
      await this.selectPriority(data.priority);
    }

    if (data.color) {
      await this.selectColor(data.color);
    }

    if (data.tags) {
      await this.fillTags(data.tags);
    }

    await this.clickSave();
  }

  async clickSave() {
    await this.saveButton.click();
    await this.modal.waitFor({ state: 'hidden' });
  }

  async clickCancel() {
    await this.cancelButton.click();
    await this.modal.waitFor({ state: 'hidden' });
  }

  async clickReset() {
    await this.resetButton.click();
  }

  async isSaveButtonDisabled(): Promise<boolean> {
    return await this.saveButton.isDisabled();
  }

  async getTitleError(): Promise<string | null> {
    const errorElement = this.page.locator('.pf-v5-c-helper-text__item.pf-m-error');
    const isVisible = await errorElement.isVisible().catch(() => false);
    return isVisible ? await errorElement.textContent() : null;
  }

  async getTitle(): Promise<string> {
    return await this.titleInput.inputValue();
  }

  async getDescription(): Promise<string> {
    return await this.descriptionInput.inputValue();
  }

  async getDate(): Promise<string> {
    return await this.dateInput.inputValue();
  }

  async getTags(): Promise<string> {
    return await this.tagsInput.inputValue();
  }
}
