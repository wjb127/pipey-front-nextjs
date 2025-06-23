'use client'

import { useState } from 'react'
import { Mail, Phone, Building2, Calendar, TrendingUp, AlertCircle, Flame, Clock } from 'lucide-react'
import { GenerateEmailButton } from '@/components/email/generate-email-button'

interface Analysis {
  id: string
  companyName: string
  industry: string
  status: 'hot' | 'processing' | 'waiting'
  priority: number
  lastAnalyzed: string
  newsCount: number
  keyInsights: string[]
  contactInfo: {
    name?: string
    position?: string
    email?: string
    phone?: string
  }
  relevantNews: {
    title: string
    date: string
    summary: string
    relevance: 'high' | 'medium' | 'low'
  }[]
}

interface SalesIntelligenceCardProps {
  analysis: Analysis
  onViewDetails?: (id: string) => void
}

export function SalesIntelligenceCard({ analysis, onViewDetails }: SalesIntelligenceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'hot':
        return <Flame className="h-4 w-4 text-red-500" />
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'hot':
        return 'Contact Now!'
      case 'processing':
        return 'Analyzing...'
      default:
        return 'Waiting'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  const getPriorityColor = (priority: number) => {
    if (priority >= 80) return 'text-red-600 bg-red-50'
    if (priority >= 60) return 'text-orange-600 bg-orange-50'
    if (priority >= 40) return 'text-yellow-600 bg-yellow-50'
    return 'text-gray-600 bg-gray-50'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <Building2 className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-bold text-gray-900">{analysis.companyName}</h3>
              <span className="text-sm text-gray-500">• {analysis.industry}</span>
            </div>
            
            <div className="flex items-center space-x-4 mb-3">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(analysis.status)}`}>
                {getStatusIcon(analysis.status)}
                <span className="ml-1">{getStatusText(analysis.status)}</span>
              </div>
              
              <div className={`px-3 py-1 rounded-lg text-sm font-bold ${getPriorityColor(analysis.priority)}`}>
                Priority: {analysis.priority}/100
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Updated {analysis.lastAnalyzed}</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4" />
                <span>{analysis.newsCount} news analyzed</span>
              </div>
            </div>
          </div>

          {analysis.status === 'hot' && (
            <div className="flex flex-col space-y-2">
              <GenerateEmailButton 
                companyName={analysis.companyName}
                insights={analysis.keyInsights}
                contactEmail={analysis.contactInfo.email}
              />
              {analysis.contactInfo.phone && (
                <button className="flex items-center space-x-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200 hover:bg-green-100 transition-colors text-sm">
                  <Phone className="h-4 w-4" />
                  <span>Call Now</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Key Insights */}
      <div className="p-6">
        <h4 className="font-semibold text-gray-900 mb-3">Key Sales Insights</h4>
        <ul className="space-y-2">
          {analysis.keyInsights.slice(0, isExpanded ? undefined : 3).map((insight, index) => (
            <li key={index} className="flex items-start space-x-2 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">{insight}</span>
            </li>
          ))}
        </ul>
        
        {analysis.keyInsights.length > 3 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {isExpanded ? 'Show less' : `Show ${analysis.keyInsights.length - 3} more insights`}
          </button>
        )}
      </div>

      {/* Contact Information */}
      {analysis.contactInfo.name && (
        <div className="px-6 pb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
            <div className="space-y-1 text-sm">
              <div><strong>Name:</strong> {analysis.contactInfo.name}</div>
              {analysis.contactInfo.position && (
                <div><strong>Position:</strong> {analysis.contactInfo.position}</div>
              )}
              {analysis.contactInfo.email && (
                <div><strong>Email:</strong> {analysis.contactInfo.email}</div>
              )}
              {analysis.contactInfo.phone && (
                <div><strong>Phone:</strong> {analysis.contactInfo.phone}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recent News */}
      {isExpanded && analysis.relevantNews.length > 0 && (
        <div className="px-6 pb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Relevant News Analysis</h4>
          <div className="space-y-3">
            {analysis.relevantNews.map((news, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-medium text-gray-900 text-sm">{news.title}</h5>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    news.relevance === 'high' ? 'bg-red-100 text-red-700' :
                    news.relevance === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {news.relevance} relevance
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{news.summary}</p>
                <span className="text-xs text-gray-500">{news.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            {isExpanded ? 'Hide details' : 'View full analysis'}
          </button>
          
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(analysis.id)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Open in dashboard →
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 