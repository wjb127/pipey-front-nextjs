import Link from 'next/link'
import { Zap, Home, TrendingUp, Settings, Building2, Bot } from 'lucide-react'

export function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Pipey
              </span>
              <div className="text-xs text-gray-500 -mt-1">Sales Intelligence</div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors group"
            >
              <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">대시보드</span>
            </Link>
            
            <Link
              href="/analytics"
              className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors group"
            >
              <TrendingUp className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">세일즈 인텔리전스</span>
            </Link>
            
            <Link
              href="/ai-tools"
              className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors group"
            >
              <Bot className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">AI 도구</span>
            </Link>
            
            <Link
              href="/company-setup"
              className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors group"
            >
              <Settings className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">고객사 설정</span>
            </Link>
          </div>

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-sm">
              시작하기
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-500 hover:text-gray-700">
              <Building2 className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (hidden by default) */}
      <div className="md:hidden border-t border-gray-200 bg-gray-50">
        <div className="px-4 py-3 space-y-3">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>대시보드</span>
          </Link>
          <Link
            href="/analytics"
            className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors"
          >
            <TrendingUp className="h-4 w-4" />
            <span>세일즈 인텔리전스</span>
          </Link>
          <Link
            href="/ai-tools"
            className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors"
          >
            <Bot className="h-4 w-4" />
            <span>AI 도구</span>
          </Link>
          <Link
            href="/company-setup"
            className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>고객사 설정</span>
          </Link>
        </div>
      </div>
    </nav>
  )
} 