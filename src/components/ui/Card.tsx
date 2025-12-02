import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false, ...rest }: CardProps) {
  const hoverStyle = hover ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-200' : '';
  return (
    <div {...rest} className={`bg-white rounded-lg shadow-md p-6 ${hoverStyle} ${className}`}>
      {children}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
  color?: string;
}

export function MetricCard({ title, value, icon, trend, color = 'green' }: MetricCardProps) {
  const colorStyles = {
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600',
    blue: 'bg-blue-100 text-blue-600',
    red: 'bg-red-100 text-red-600',
  } as const;

  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && <p className="text-sm text-gray-500 mt-1">{trend}</p>}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${colorStyles[color as keyof typeof colorStyles]}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
