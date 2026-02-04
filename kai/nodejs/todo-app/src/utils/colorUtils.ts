import type { ColorMap } from '../types/todo';

export const COLOR_TOKENS: ColorMap = {
  red: {
    token: 'global_danger_color_100',
    cssVar: "--pf-t--global--color--status--danger--default",
    label: 'Red',
    background: '#c9190b'
  },
  orange: {
    token: 'global_warning_color_100',
    cssVar: "--pf-t--global--color--status--warning--default",
    label: 'Orange',
    background: '#f0ab00'
  },
  blue: {
    token: 'global_info_color_100',
    cssVar: "--pf-t--global--color--status--info--default",
    label: 'Blue',
    background: '#2b9af3'
  },
  green: {
    token: 'global_success_color_100',
    cssVar: "--pf-t--global--color--status--success--default",
    label: 'Green',
    background: '#3e8635'
  },
  purple: {
    token: 'global_purple_100',
    cssVar: '--pf-t--global--color--nonstatus--purple--default',
    label: 'Purple',
    background: '#6753ac'
  },
  gray: {
    token: 'global_Color_200',
    cssVar: "--pf-t--global--text--color--subtle",
    label: 'Gray',
    background: '#6a6e73'
  }
};

export const getPriorityColor = (priority?: string): 'red' | 'orange' | 'grey' => {
  if (!priority) return 'grey';
  return priority === 'high' ? 'red' : priority === 'medium' ? 'orange' : 'grey';
};
