import { Page } from '@playwright/test';

export function formatDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

export function getTodayDate(): string {
  return formatDate(new Date());
}

export function getPastDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return formatDate(date);
}

export function getFutureDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return formatDate(date);
}

export function generateTodoId(): string {
  return `test-todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function waitForStorageUpdate(page: Page, timeout: number = 500): Promise<void> {
  await page.waitForTimeout(timeout);
}

export function getISOTimestamp(date?: Date): string {
  return (date || new Date()).toISOString();
}
