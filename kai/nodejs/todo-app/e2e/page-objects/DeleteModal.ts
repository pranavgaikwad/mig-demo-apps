import { Page, Locator } from '@playwright/test';

export class DeleteModal {
  readonly modal: Locator;
  readonly modalTitle: Locator;
  readonly deleteButton: Locator;
  readonly cancelButton: Locator;
  readonly todoTitleText: Locator;

  constructor(private page: Page) {
    this.modal = page.locator('.pf-v6-c-modal-box').filter({ hasText: 'Delete TODO' });
    this.modalTitle = page.locator('[data-test-id="delete-modal-title"]');
    this.deleteButton = page.getByRole('button', { name: 'Delete' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    // After PF6 migration, Modal uses ModalBody instead of custom div wrapper
    this.todoTitleText = page.locator('.pf-v6-c-modal-box__body strong');
  }

  async waitForModal() {
    await this.modal.waitFor({ state: 'visible' });
  }

  async confirmDelete() {
    await this.deleteButton.click();
    await this.modal.waitFor({ state: 'hidden' });
  }

  async cancelDelete() {
    await this.cancelButton.click();
    await this.modal.waitFor({ state: 'hidden' });
  }

  async getTodoTitle(): Promise<string> {
    return await this.todoTitleText.textContent() || '';
  }
}
