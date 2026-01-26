import type { ColorMap } from '../types/todo';

export const COLOR_TOKENS: ColorMap = {
  red: {
    token: 'global_danger_color_100',
    cssVar: '--pf-v5-global--danger-color--100',
    label: 'Red',
    background: '#c9190b'
  },
  orange: {
    token: 'global_warning_color_100',
    cssVar: '--pf-v5-global--warning-color--100',
    label: 'Orange',
    background: '#f0ab00'
  },
  blue: {
    token: 'global_info_color_100',
    cssVar: '--pf-v5-global--info-color--100',
    label: 'Blue',
    background: '#2b9af3'
  },
  green: {
    token: 'global_success_color_100',
    cssVar: '--pf-v5-global--success-color--100',
    label: 'Green',
    background: '#3e8635'
  },
  purple: {
    token: 'global_purple_100',
    cssVar: '--pf-v5-global--purple--100',
    label: 'Purple',
    background: '#6753ac'
  },
  gray: {
    token: 'global_Color_200',
    cssVar: '--pf-v5-global--Color--200',
    label: 'Gray',
    background: '#6a6e73'
  }
};

export const getPriorityColor = (priority?: string): 'red' | 'orange' | 'grey' => {
  if (!priority) return 'grey';
  return priority === 'high' ? 'red' : priority === 'medium' ? 'orange' : 'grey';
};
