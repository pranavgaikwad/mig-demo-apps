export const parseDate = (dateString: string): Date => {
  // Parse MM/DD/YYYY format
  const parts = dateString.split('/');
  if (parts.length !== 3) {
    return new Date();
  }

  const month = parseInt(parts[0], 10) - 1; // JS months are 0-indexed
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  return new Date(year, month, day);
};

export const formatDate = (date: Date): string => {
  // Format as MM/DD/YYYY
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
};

export const convertToMMDDYYYY = (dateString: string): string => {
  // Convert various date formats to MM/DD/YYYY
  if (!dateString) return '';

  // Already in MM/DD/YYYY format
  if (/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(dateString)) {
    return dateString;
  }

  // ISO format YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const date = new Date(dateString + 'T00:00:00');
    return formatDate(date);
  }

  // Try to parse as ISO timestamp
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return formatDate(date);
  }

  return dateString;
};

export const isValidDate = (dateString: string): boolean => {
  const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
  if (!dateRegex.test(dateString)) {
    return false;
  }

  const date = parseDate(dateString);
  return !isNaN(date.getTime());
};

export const isOverdue = (targetDate?: string): boolean => {
  if (!targetDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = parseDate(targetDate);
  target.setHours(0, 0, 0, 0);

  return target < today;
};

export const isTodayOrBefore = (dateString: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = parseDate(dateString);
  date.setHours(0, 0, 0, 0);

  return date <= today;
};

export const isToday = (dateString: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);

  return date.getTime() === today.getTime();
};
