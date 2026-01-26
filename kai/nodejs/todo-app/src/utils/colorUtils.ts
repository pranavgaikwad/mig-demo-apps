import type { ColorMap } from '../types/todo';

export const COLOR_TOKENS: ColorMap = {
  red: {
    token: 'color_status_danger_default',
    cssVar: '--pf-t--global--color--status--danger--default',
    label: 'Red',
    background: '#c9190b'
  },
  orange: {
    token: 'color_status_warning_default',
    cssVar: '--pf-t--global--color--status--warning--default',
    label: 'Orange',
    background: '#f0ab00'
  },
  blue: {
    token: 'color_status_info_default',
    cssVar: '--pf-t--global--color--status--info--default',
    label: 'Blue',
    background: '#2b9af3'
  },
  green: {
    token: 'color_status_success_default',
    cssVar: '--pf-t--global--color--status--success--default',
    label: 'Green',
    background: '#3e8635'
  },
  purple: {
    token: 'color_purple_default',
    cssVar: '--pf-t--global--color--purple--default',
    label: 'Purple',
    background: '#6753ac'
  },
  gray: {
    token: 'text_color_regular',
    cssVar: '--pf-t--global--text--color--regular',
    label: 'Gray',
    background: '#6a6e73'
  }
};

export const getPriorityColor = (priority?: string): 'red' | 'orange' | 'grey' => {
  if (!priority) return 'grey';
  return priority === 'high' ? 'red' : priority === 'medium' ? 'orange' : 'grey';
};
