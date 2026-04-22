import type { Route } from 'next';

export type KPI = {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
};

export type ChartPoint = {
  name: string;
  value: number;
};

export type ModuleSummary = {
  id: string;
  title: string;
  description: string;
  href: Route;
  metrics: Array<{ label: string; value: string }>;
};
