import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  suffix?: string
  icon: ReactNode
  description?: string
  trend?: string | {
    value: number
    isPositive: boolean
  }
  color?: 'blue' | 'green' | 'red' | 'purple' | 'yellow' | 'gray'
  className?: string
}

export function StatsCard({ 
  title, 
  value, 
  suffix,
  icon, 
  description, 
  trend, 
  color = 'blue',
  className 
}: StatsCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 text-white',
    green: 'from-green-500 to-green-600 text-white',
    red: 'from-red-500 to-red-600 text-white',
    purple: 'from-purple-500 to-purple-600 text-white',
    yellow: 'from-yellow-500 to-yellow-600 text-white',
    gray: 'from-gray-500 to-gray-600 text-white'
  }

  const iconBgClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    gray: 'bg-gray-100 text-gray-600'
  }

  const formatTrend = (trend?: string | { value: number; isPositive: boolean }) => {
    if (!trend) return null
    
    if (typeof trend === 'string') {
      const isPositive = trend.includes('+')
      return (
        <div className={cn(
          'flex items-center space-x-1 text-xs font-medium',
          isPositive ? 'text-green-100' : 'text-red-100'
        )}>
          <span>{isPositive ? '↗' : '↘'}</span>
          <span>{trend}</span>
          <span className="text-white/80">vs 지난 주</span>
        </div>
      )
    }
    
    return (
      <div className={cn(
        'flex items-center space-x-1 text-xs font-medium',
        trend.isPositive ? 'text-green-100' : 'text-red-100'
      )}>
        <span>{trend.isPositive ? '↗' : '↘'}</span>
        <span>{Math.abs(trend.value)}%</span>
        <span className="text-white/80">vs 지난 주</span>
      </div>
    )
  }

  return (
    <div className={cn(
      'bg-gradient-to-r rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all',
      colorClasses[color],
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <div className={cn(
              'p-2 rounded-lg',
              iconBgClasses[color]
            )}>
              {icon}
            </div>
            <h3 className="text-sm font-medium text-white/90">{title}</h3>
          </div>
          
          <div className="text-3xl font-bold text-white mb-2">
            {value}{suffix && <span className="text-xl text-white/80 ml-1">{suffix}</span>}
          </div>
          
          {description && (
            <p className="text-sm text-white/70 mb-2">
              {description}
            </p>
          )}
          
          {formatTrend(trend)}
        </div>
      </div>
    </div>
  )
} 