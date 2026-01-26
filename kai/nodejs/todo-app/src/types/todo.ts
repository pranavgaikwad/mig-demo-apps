export interface Todo {
  id: string;
  title: string;                  // REQUIRED
  description?: string;            // OPTIONAL
  targetDate?: string;            // OPTIONAL, format: MM/DD/YYYY
  priority?: 'high' | 'medium' | 'low';  // OPTIONAL
  color?: 'red' | 'orange' | 'blue' | 'green' | 'purple' | 'gray';  // OPTIONAL
  tags: string[];                 // OPTIONAL, comma-separated
  status: 'active' | 'archived';  // active by default, archived when marked done
  createdAt: string;              // ISO timestamp
  updatedAt: string;              // ISO timestamp
}

export interface TodoFormData {
  title: string;
  description?: string;
  targetDate?: string;
  priority?: 'high' | 'medium' | 'low';
  color?: 'red' | 'orange' | 'blue' | 'green' | 'purple' | 'gray';
  tagsString: string;  // For form input
}

export interface ColorToken {
  token: string;
  cssVar: string;
  label: string;
  background: string;
}

export type ColorMap = {
  [K in NonNullable<Todo['color']>]: ColorToken;
};
