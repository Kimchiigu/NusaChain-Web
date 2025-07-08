import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export default function StatsCard({ title, value, icon, trend, description }: StatsCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center text-white">
            {icon}
          </div>
        </div>
        
        {trend && (
          <div className="mt-4 flex items-center">
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              trend.isPositive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              <span className={`mr-1 ${trend.isPositive ? '↗' : '↘'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            </div>
            <span className="ml-2 text-sm text-gray-500">vs last month</span>
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full transform translate-x-8 -translate-y-8" />
      </CardContent>
    </Card>
  );
}