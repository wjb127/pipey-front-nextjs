import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatsCard({ 
  title, 
  value, 
  icon, 
  description, 
  trend, 
  className 
}: StatsCardProps) {
  return (
    <div className={cn(
      'bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow',
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className="text-gray-600">
              {icon}
            </div>
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          </div>
          
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {value}
          </div>
          
          {description && (
            <p className="text-sm text-gray-500">
              {description}
            </p>
          )}
          
          {trend && (
            <div className={cn(
              'flex items-center space-x-1 text-xs font-medium mt-2',
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            )}>
              <span>{trend.isPositive ? '↗' : '↘'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-gray-500">vs 지난 주</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 