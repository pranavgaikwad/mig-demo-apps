import { Page } from '@playwright/test';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  targetDate?: string;
  priority?: 'high' | 'medium' | 'low';
  color?: 'red' | 'orange' | 'blue' | 'green' | 'purple' | 'gray';
  tags: string[];
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'todos-data';

export class LocalStorageHelper {
  constructor(private page: Page) {}

  async setTodos(todos: Todo[]): Promise<void> {
    await this.page.evaluate(
      ({ key, data }) => {
        localStorage.setItem(key, JSON.stringify(data));
      },
      { key: STORAGE_KEY, data: todos }
    );
  }

  async getTodos(): Promise<Todo[]> {
    return await this.page.evaluate((key) => {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    }, STORAGE_KEY);
  }

  async clearTodos(): Promise<void> {
    await this.page.evaluate((key) => {
      localStorage.removeItem(key);
    }, STORAGE_KEY);
  }

  async clearAllStorage(reload: boolean = false): Promise<void> {
    await this.page.evaluate(() => {
      localStorage.clear();
    });
    if (reload) {
      await this.page.reload();
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  async seedWithTestData(todos: Todo[]): Promise<void> {
    await this.page.evaluate(
      ({ key, data }) => {
        localStorage.clear();
        localStorage.setItem(key, JSON.stringify(data));
      },
      { key: 'todos-data', data: todos }
    );
    await this.page.reload();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(200);
  }

  async initializeWithData(path: string, todos: Todo[]): Promise<void> {
    // Set localStorage BEFORE page loads using addInitScript
    await this.page.addInitScript(
      ({ key, data }) => {
        localStorage.setItem(key, JSON.stringify(data));
      },
      { key: 'todos-data', data: todos }
    );

    // Now navigate - localStorage will already be set
    await this.page.goto(path);
    await this.page.waitForLoadState('networkidle');

    // Wait for React to render - longer wait for complex pages
    await this.page.waitForTimeout(2000);

    // If path is /todos, wait for table to be ready with the data
    if (path.includes('/todos')) {
      const activeTodos = todos.filter(t => t.status === 'active');
      if (activeTodos.length > 0) {
        // Wait for table to have the expected number of rows
        await this.page.waitForFunction(
          ({ tableSelector, expectedRows }) => {
            const table = document.querySelector(tableSelector);
            if (!table) return false;
            const rows = table.querySelectorAll('tbody tr');
            return rows.length >= expectedRows;
          },
          { tableSelector: 'table[aria-label="TODO list"]', expectedRows: activeTodos.length },
          { timeout: 15000 }
        ).catch(() => {
          // If table doesn't load, continue anyway (might be filtered)
        });
      }
    }
  }

  async waitForStorageUpdate(timeout: number = 1000): Promise<void> {
    await this.page.waitForTimeout(timeout);
  }
}
