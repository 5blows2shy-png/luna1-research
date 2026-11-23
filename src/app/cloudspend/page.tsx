import type { Metadata } from 'next';
import { CloudSpend } from '@/components/cloudspend/cloudspend';
export const metadata: Metadata = {
  title: 'Luna1 CloudSpend | FinOps Intelligence Platform',
  description: 'Explore AWS, Azure and simulated VMware cost allocation, safeguarded VM rightsizing, financial forecasts and cost anomalies. Import daily FOCUS billing CSVs locally.',
  alternates: { canonical: '/cloudspend' },
};
export default function CloudSpendPage() { return <CloudSpend/>; }
