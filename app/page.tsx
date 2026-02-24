'use client'

import React, { useState, useCallback } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  HiMagnifyingGlass,
  HiArrowTrendingUp,
  HiArrowTrendingDown,
  HiMinus,
  HiChevronUp,
  HiChevronDown,
  HiExclamationTriangle,
  HiArrowPath,
  HiShieldCheck,
  HiClock,
  HiBolt,
  HiInformationCircle,
  HiChartBar,
} from 'react-icons/hi2'
import {
  RiStockLine,
  RiExchangeLine,
  RiLineChartLine,
  RiFundsLine,
  RiPulseLine,
} from 'react-icons/ri'
import {
  TbTargetArrow,
  TbChartCandle,
  TbActivityHeartbeat,
  TbReportAnalytics,
} from 'react-icons/tb'
import {
  BiDollarCircle,
  BiTrendingUp,
  BiTrendingDown,
} from 'react-icons/bi'

const AGENT_ID = '699d7b98f015fb55287cbfa6'

interface StockAnalysis {
  stock_name: string
  exchange: string
  sector: string
  current_price: string
  open_price: string
  days_high: string
  days_low: string
  week_52_high: string
  week_52_low: string
  volume: string
  market_cap: string
  pe_ratio: string
  previous_close: string
  change_percent: string
  trend: string
  signal: string
  support_1: string
  support_2: string
  resistance_1: string
  resistance_2: string
  entry_price: string
  target_1: string
  target_2: string
  target_3: string
  stop_loss: string
  risk_reward_ratio: string
  time_horizon: string
  analysis_summary: string
  disclaimer: string
}

const POPULAR_STOCKS = [
  'RELIANCE',
  'TCS',
  'INFOSYS',
  'HDFC BANK',
  'ICICI BANK',
  'WIPRO',
  'BHARTI AIRTEL',
  'ITC',
]

const SAMPLE_DATA: StockAnalysis = {
  stock_name: 'Reliance Industries Limited',
  exchange: 'NSE',
  sector: 'Oil & Gas / Conglomerate',
  current_price: '2,847.50',
  open_price: '2,832.00',
  days_high: '2,865.30',
  days_low: '2,825.10',
  week_52_high: '3,024.90',
  week_52_low: '2,220.30',
  volume: '12,45,678',
  market_cap: '19.26 Lakh Crore',
  pe_ratio: '28.5',
  previous_close: '2,830.75',
  change_percent: '+0.59%',
  trend: 'Bullish',
  signal: 'Buy',
  support_1: '2,810.00',
  support_2: '2,775.00',
  resistance_1: '2,880.00',
  resistance_2: '2,920.00',
  entry_price: '2,840.00',
  target_1: '2,900.00',
  target_2: '2,960.00',
  target_3: '3,050.00',
  stop_loss: '2,770.00',
  risk_reward_ratio: '1:2.5',
  time_horizon: 'Short-term (1-2 weeks)',
  analysis_summary:
    '**Reliance Industries** is showing a **bullish trend** on the daily chart with strong momentum. The stock has broken above its 20-day moving average and is trading above key support levels.\n\n### Key Observations:\n- RSI at 62, indicating moderate bullish momentum\n- MACD has given a bullish crossover\n- Volume is above average, confirming the uptrend\n- The stock is forming a **cup and handle pattern** on the weekly chart\n\n### Recommendation:\nBuy at current levels or on dips to the entry price with a strict stop loss. Book partial profits at Target 1 and trail the stop loss for remaining position.',
  disclaimer:
    'This analysis is for educational and informational purposes only. It does not constitute financial advice. Stock market investments are subject to market risks. Past performance is not indicative of future results. Always consult with a qualified financial advisor before making investment decisions.',
}

function parsePrice(val: string | undefined | null): number {
  if (!val) return 0
  return parseFloat(val.replace(/[^0-9.-]/g, '')) || 0
}

function isPositiveChange(changeStr: string | undefined | null): boolean {
  if (!changeStr) return false
  return !changeStr.trim().startsWith('-')
}

function getSignalColor(signal: string | undefined | null): string {
  if (!signal) return 'bg-gray-600'
  const s = signal.toLowerCase()
  if (s.includes('strong buy')) return 'bg-emerald-500'
  if (s.includes('buy')) return 'bg-green-500'
  if (s.includes('strong sell')) return 'bg-red-600'
  if (s.includes('sell')) return 'bg-red-500'
  if (s.includes('hold')) return 'bg-amber-500'
  return 'bg-gray-600'
}

function getTrendIcon(trend: string | undefined | null) {
  if (!trend) return <HiMinus className="w-5 h-5 text-gray-400" />
  const t = trend.toLowerCase()
  if (t.includes('bullish')) return <HiArrowTrendingUp className="w-5 h-5 text-green-400" />
  if (t.includes('bearish')) return <HiArrowTrendingDown className="w-5 h-5 text-red-400" />
  return <HiMinus className="w-5 h-5 text-amber-400" />
}

function getTrendColor(trend: string | undefined | null): string {
  if (!trend) return 'text-gray-400'
  const t = trend.toLowerCase()
  if (t.includes('bullish')) return 'text-green-400'
  if (t.includes('bearish')) return 'text-red-400'
  return 'text-amber-400'
}

function renderMarkdown(text: string) {
  if (!text) return null
  return (
    <div className="space-y-2">
      {text.split('\n').map((line, i) => {
        if (line.startsWith('### '))
          return (
            <h4 key={i} className="font-semibold text-sm mt-3 mb-1 text-gray-200">
              {line.slice(4)}
            </h4>
          )
        if (line.startsWith('## '))
          return (
            <h3 key={i} className="font-semibold text-base mt-3 mb-1 text-gray-100">
              {line.slice(3)}
            </h3>
          )
        if (line.startsWith('# '))
          return (
            <h2 key={i} className="font-bold text-lg mt-4 mb-2 text-gray-100">
              {line.slice(2)}
            </h2>
          )
        if (line.startsWith('- ') || line.startsWith('* '))
          return (
            <li key={i} className="ml-4 list-disc text-sm text-gray-300">
              {formatInline(line.slice(2))}
            </li>
          )
        if (/^\d+\.\s/.test(line))
          return (
            <li key={i} className="ml-4 list-decimal text-sm text-gray-300">
              {formatInline(line.replace(/^\d+\.\s/, ''))}
            </li>
          )
        if (!line.trim()) return <div key={i} className="h-1" />
        return (
          <p key={i} className="text-sm text-gray-300">
            {formatInline(line)}
          </p>
        )
      })}
    </div>
  )
}

function formatInline(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-gray-100">
        {part}
      </strong>
    ) : (
      part
    )
  )
}

function LoadingPulse() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3 mb-6">
        <RiPulseLine className="w-6 h-6 text-cyan-400 animate-pulse" />
        <span className="text-cyan-400 text-lg font-medium animate-pulse">
          Analyzing market data...
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-700 rounded w-3/4" />
              <div className="h-8 bg-gray-700 rounded w-1/2" />
              <div className="h-3 bg-gray-700 rounded w-full" />
              <div className="h-3 bg-gray-700 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-gray-700 rounded w-1/3" />
          <div className="h-40 bg-gray-700 rounded w-full" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((n) => (
          <div key={n} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <div className="animate-pulse space-y-3">
              <div className="h-5 bg-gray-700 rounded w-1/2" />
              <div className="h-24 bg-gray-700 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-gray-500 text-sm mt-4">
        Fetching NSE/BSE data and running technical analysis...
      </p>
    </div>
  )
}

function Week52RangeBar({ low, high, current }: { low: string; high: string; current: string }) {
  const lowVal = parsePrice(low)
  const highVal = parsePrice(high)
  const curVal = parsePrice(current)

  if (highVal <= lowVal) {
    return (
      <div className="mt-2">
        <div className="h-2 rounded-full bg-gray-700" />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{low || 'N/A'}</span>
          <span>{high || 'N/A'}</span>
        </div>
      </div>
    )
  }

  const pct = Math.min(100, Math.max(0, ((curVal - lowVal) / (highVal - lowVal)) * 100))

  return (
    <div className="mt-2">
      <div className="relative h-2 rounded-full bg-gray-700 overflow-visible">
        <div
          className="absolute h-2 rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-green-500"
          style={{ width: '100%' }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-cyan-400 shadow-lg shadow-cyan-400/30"
          style={{ left: `calc(${pct}% - 7px)` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1.5">
        <span>52W Low: {low || 'N/A'}</span>
        <span>52W High: {high || 'N/A'}</span>
      </div>
    </div>
  )
}

function PriceLadder({ data }: { data: StockAnalysis }) {
  const levels = [
    { label: 'Target 3', value: data?.target_3, color: 'bg-emerald-500', textColor: 'text-emerald-400', borderColor: 'border-emerald-500/40' },
    { label: 'Target 2', value: data?.target_2, color: 'bg-green-500', textColor: 'text-green-400', borderColor: 'border-green-500/40' },
    { label: 'Target 1', value: data?.target_1, color: 'bg-green-400', textColor: 'text-green-300', borderColor: 'border-green-400/40' },
    { label: 'Resistance 2', value: data?.resistance_2, color: 'bg-orange-400', textColor: 'text-orange-300', borderColor: 'border-orange-400/40' },
    { label: 'Resistance 1', value: data?.resistance_1, color: 'bg-orange-300', textColor: 'text-orange-200', borderColor: 'border-orange-300/40' },
    { label: 'Entry Price', value: data?.entry_price, color: 'bg-cyan-400', textColor: 'text-cyan-300', borderColor: 'border-cyan-400/50' },
    { label: 'Current Price', value: data?.current_price, color: 'bg-white', textColor: 'text-white', borderColor: 'border-white/50' },
    { label: 'Support 1', value: data?.support_1, color: 'bg-blue-400', textColor: 'text-blue-300', borderColor: 'border-blue-400/40' },
    { label: 'Support 2', value: data?.support_2, color: 'bg-blue-500', textColor: 'text-blue-400', borderColor: 'border-blue-500/40' },
    { label: 'Stop Loss', value: data?.stop_loss, color: 'bg-red-500', textColor: 'text-red-400', borderColor: 'border-red-500/40' },
  ]

  const currentPriceVal = parsePrice(data?.current_price)

  return (
    <div className="space-y-1.5">
      {levels.map((level, idx) => {
        const priceVal = parsePrice(level.value)
        let pctDiff = ''
        if (currentPriceVal > 0 && priceVal > 0 && level.label !== 'Current Price') {
          const diff = ((priceVal - currentPriceVal) / currentPriceVal) * 100
          pctDiff = `${diff >= 0 ? '+' : ''}${diff.toFixed(2)}%`
        }

        const isCurrentPrice = level.label === 'Current Price'
        const isTarget = level.label.startsWith('Target')
        const isStopLoss = level.label === 'Stop Loss'
        const isEntry = level.label === 'Entry Price'

        return (
          <div
            key={idx}
            className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${level.borderColor} ${isCurrentPrice ? 'bg-white/5 border-white/30' : 'bg-gray-800/40 hover:bg-gray-800/60'}`}
          >
            <div className={`w-3 h-3 rounded-full ${level.color} shrink-0 ${isCurrentPrice ? 'animate-pulse shadow-lg shadow-white/30' : ''}`} />
            <div className="flex-1 min-w-0">
              <span className={`text-xs font-medium ${level.textColor}`}>
                {level.label}
              </span>
            </div>
            <div className="text-right flex items-center gap-2">
              <span className={`font-mono text-sm font-semibold ${level.textColor}`}>
                {level.value || 'N/A'}
              </span>
              {pctDiff && (
                <span className={`text-xs font-mono ${pctDiff.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  ({pctDiff})
                </span>
              )}
            </div>
            <div className="w-5 flex justify-center">
              {isTarget && <HiChevronUp className="w-4 h-4 text-green-400" />}
              {isStopLoss && <HiChevronDown className="w-4 h-4 text-red-400" />}
              {isEntry && <TbTargetArrow className="w-4 h-4 text-cyan-400" />}
              {isCurrentPrice && <RiStockLine className="w-4 h-4 text-white" />}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DataRow({ label, value, icon }: { label: string; value: string | undefined | null; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-0">
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-mono text-sm text-gray-200 font-medium">{value || 'N/A'}</span>
    </div>
  )
}

function AgentStatusBar({ isActive }: { isActive: boolean }) {
  return (
    <div className="bg-gray-800/60 border border-gray-700/50 rounded-lg p-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <TbActivityHeartbeat className={`w-4 h-4 ${isActive ? 'text-cyan-400 animate-pulse' : 'text-gray-500'}`} />
        <span className="text-xs text-gray-400">Stock Market Analyst Agent</span>
        <span className="text-xs text-gray-600 font-mono">({AGENT_ID.slice(0, 8)}...)</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-cyan-400 animate-pulse' : 'bg-gray-600'}`} />
        <span className={`text-xs ${isActive ? 'text-cyan-400' : 'text-gray-500'}`}>
          {isActive ? 'Analyzing...' : 'Ready'}
        </span>
      </div>
    </div>
  )
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100">
          <div className="text-center p-8 max-w-md">
            <HiExclamationTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-gray-400 mb-4 text-sm">{this.state.error}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: '' })}
              className="px-4 py-2 bg-cyan-600 text-white rounded-md text-sm hover:bg-cyan-500 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default function Page() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<StockAnalysis | null>(null)
  const [error, setError] = useState('')
  const [showSample, setShowSample] = useState(false)

  const displayData = showSample ? SAMPLE_DATA : result

  const analyzeStock = useCallback(async (stockName: string) => {
    if (!stockName.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const response = await callAIAgent(
        `Analyze the stock ${stockName} from NSE/BSE. Provide current market data, technical analysis, target prices, stop loss, and trading recommendation.`,
        AGENT_ID
      )
      if (response?.success) {
        const data = response?.response?.result as StockAnalysis
        setResult(data)
      } else {
        setError(response?.error || response?.response?.message || 'Failed to analyze stock. Please try again.')
      }
    } catch (err) {
      setError('Failed to analyze stock. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = useCallback(() => {
    analyzeStock(query)
  }, [query, analyzeStock])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handleSearch()
    },
    [handleSearch]
  )

  const handleQuickStock = useCallback(
    (stock: string) => {
      setQuery(stock)
      setShowSample(false)
      analyzeStock(stock)
    },
    [analyzeStock]
  )

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-950 text-gray-100">
        {/* Header */}
        <header className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 border-b border-gray-800">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 via-transparent to-blue-900/10" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  <RiStockLine className="w-7 h-7 text-cyan-400" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    StockPulse
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-400">
                    NSE & BSE Market Analyzer
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">Sample Data</span>
                <Switch
                  checked={showSample}
                  onCheckedChange={(checked) => {
                    setShowSample(checked)
                    if (checked) {
                      setError('')
                    }
                  }}
                />
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-500 max-w-2xl">
              Real-time stock analysis with AI-powered target & stop loss recommendations for Indian markets
            </p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Search Section */}
          <Card className="bg-gray-900/80 border-gray-800 shadow-xl shadow-black/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter stock name or symbol (e.g., RELIANCE, TCS, INFY)"
                    className="pl-10 bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 h-12 text-base focus:border-cyan-500 focus:ring-cyan-500/20"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={loading || !query.trim()}
                  className="h-12 px-6 bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <HiArrowPath className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <RiLineChartLine className="w-4 h-4" />
                      Analyze
                    </span>
                  )}
                </Button>
              </div>

              {/* Popular Stocks */}
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1.5">
                  <HiBolt className="w-3.5 h-3.5" />
                  Popular Stocks
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_STOCKS.map((stock) => (
                    <button
                      key={stock}
                      onClick={() => handleQuickStock(stock)}
                      disabled={loading}
                      className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-cyan-300 hover:border-cyan-700/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {stock}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agent Status */}
          <AgentStatusBar isActive={loading} />

          {/* Error State */}
          {error && !showSample && (
            <Card className="bg-red-950/30 border-red-800/50">
              <CardContent className="p-4 flex items-center gap-3">
                <HiExclamationTriangle className="w-5 h-5 text-red-400 shrink-0" />
                <p className="text-sm text-red-300 flex-1">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSearch}
                  className="border-red-700 text-red-300 hover:bg-red-900/30"
                >
                  <HiArrowPath className="w-3.5 h-3.5 mr-1" />
                  Retry
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {loading && !showSample && <LoadingPulse />}

          {/* Empty State */}
          {!loading && !displayData && !error && (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
              <div className="p-4 bg-gray-800/50 rounded-2xl border border-gray-700/50 mb-6">
                <TbChartCandle className="w-12 h-12 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                Ready to Analyze
              </h3>
              <p className="text-sm text-gray-500 max-w-md mb-6">
                Search for any NSE or BSE listed stock above to get comprehensive technical analysis, target prices, stop loss levels, and AI-powered trading recommendations.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg">
                {['Price Data', 'Targets & SL', 'Support/Resistance', 'AI Analysis'].map(
                  (feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 text-xs text-gray-500 bg-gray-800/40 rounded-lg px-3 py-2 border border-gray-700/30"
                    >
                      <HiShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                      {feature}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Results Dashboard */}
          {displayData && !loading && (
            <div className="space-y-6">
              {/* Top Section: Stock Overview + Signal */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stock Overview Card */}
                <div className="lg:col-span-2">
                  <Card className="bg-gray-900/80 border-gray-800 h-full">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <CardTitle className="text-xl sm:text-2xl text-white truncate">
                              {displayData?.stock_name ?? 'N/A'}
                            </CardTitle>
                            <Badge variant="outline" className="border-cyan-700/50 text-cyan-300 bg-cyan-950/30 text-xs shrink-0">
                              {displayData?.exchange ?? 'N/A'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {displayData?.sector ?? 'N/A'}
                          </p>
                        </div>
                        <div className="text-left sm:text-right shrink-0">
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl sm:text-4xl font-bold font-mono text-white tracking-tight">
                              {displayData?.current_price ?? 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-1 justify-start sm:justify-end">
                            {isPositiveChange(displayData?.change_percent) ? (
                              <BiTrendingUp className="w-4 h-4 text-green-400" />
                            ) : (
                              <BiTrendingDown className="w-4 h-4 text-red-400" />
                            )}
                            <span
                              className={`text-lg font-semibold font-mono ${isPositiveChange(displayData?.change_percent) ? 'text-green-400' : 'text-red-400'}`}
                            >
                              {displayData?.change_percent ?? 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
                          <p className="text-xs text-gray-500 mb-1">Open</p>
                          <p className="font-mono text-sm font-medium text-gray-200">{displayData?.open_price ?? 'N/A'}</p>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
                          <p className="text-xs text-gray-500 mb-1">Prev Close</p>
                          <p className="font-mono text-sm font-medium text-gray-200">{displayData?.previous_close ?? 'N/A'}</p>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
                          <p className="text-xs text-gray-500 mb-1">Day High</p>
                          <p className="font-mono text-sm font-medium text-green-400">{displayData?.days_high ?? 'N/A'}</p>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
                          <p className="text-xs text-gray-500 mb-1">Day Low</p>
                          <p className="font-mono text-sm font-medium text-red-400">{displayData?.days_low ?? 'N/A'}</p>
                        </div>
                      </div>

                      <Separator className="bg-gray-800" />

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <DataRow
                          label="Volume"
                          value={displayData?.volume}
                          icon={<HiChartBar className="w-3.5 h-3.5" />}
                        />
                        <DataRow
                          label="Market Cap"
                          value={displayData?.market_cap}
                          icon={<BiDollarCircle className="w-3.5 h-3.5" />}
                        />
                        <DataRow
                          label="P/E Ratio"
                          value={displayData?.pe_ratio}
                          icon={<RiFundsLine className="w-3.5 h-3.5" />}
                        />
                      </div>

                      {/* 52 Week Range */}
                      <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                        <p className="text-xs text-gray-500 mb-2 flex items-center gap-1.5">
                          <RiExchangeLine className="w-3.5 h-3.5" />
                          52-Week Range
                        </p>
                        <Week52RangeBar
                          low={displayData?.week_52_low ?? ''}
                          high={displayData?.week_52_high ?? ''}
                          current={displayData?.current_price ?? ''}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Trading Signal Card */}
                <div className="lg:col-span-1">
                  <Card className="bg-gray-900/80 border-gray-800 h-full">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                        <HiBolt className="w-4 h-4 text-cyan-400" />
                        Trading Signal
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      {/* Signal */}
                      <div className="text-center py-4">
                        <div
                          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl ${getSignalColor(displayData?.signal)} text-white font-bold text-lg shadow-lg`}
                        >
                          {displayData?.signal?.toLowerCase().includes('buy') ? (
                            <HiArrowTrendingUp className="w-5 h-5" />
                          ) : displayData?.signal?.toLowerCase().includes('sell') ? (
                            <HiArrowTrendingDown className="w-5 h-5" />
                          ) : (
                            <HiMinus className="w-5 h-5" />
                          )}
                          {displayData?.signal ?? 'N/A'}
                        </div>
                      </div>

                      <Separator className="bg-gray-800" />

                      {/* Trend */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Trend</span>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(displayData?.trend)}
                          <span className={`font-medium text-sm ${getTrendColor(displayData?.trend)}`}>
                            {displayData?.trend ?? 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Risk Reward */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Risk:Reward</span>
                        <div className="flex items-center gap-2">
                          <HiShieldCheck className="w-4 h-4 text-cyan-400" />
                          <span className="font-mono text-sm font-medium text-cyan-300">
                            {displayData?.risk_reward_ratio ?? 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Time Horizon */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Time Horizon</span>
                        <div className="flex items-center gap-2">
                          <HiClock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-200">
                            {displayData?.time_horizon ?? 'N/A'}
                          </span>
                        </div>
                      </div>

                      <Separator className="bg-gray-800" />

                      {/* Quick Levels */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between bg-cyan-950/20 border border-cyan-800/30 rounded-lg px-3 py-2">
                          <span className="text-xs text-cyan-400 flex items-center gap-1.5">
                            <TbTargetArrow className="w-3.5 h-3.5" />
                            Entry
                          </span>
                          <span className="font-mono text-sm font-medium text-cyan-300">
                            {displayData?.entry_price ?? 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-red-950/20 border border-red-800/30 rounded-lg px-3 py-2">
                          <span className="text-xs text-red-400 flex items-center gap-1.5">
                            <HiExclamationTriangle className="w-3.5 h-3.5" />
                            Stop Loss
                          </span>
                          <span className="font-mono text-sm font-medium text-red-300">
                            {displayData?.stop_loss ?? 'N/A'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Middle Section: Price Ladder + Support/Resistance */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Price Ladder - PRIMARY FEATURE */}
                <Card className="bg-gray-900/80 border-gray-800 border-cyan-800/20 shadow-lg shadow-cyan-900/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-white flex items-center gap-2">
                      <TbTargetArrow className="w-5 h-5 text-cyan-400" />
                      Target & Stop Loss Levels
                    </CardTitle>
                    <p className="text-xs text-gray-500 mt-1">
                      Price ladder showing entry, targets, support/resistance, and stop loss
                    </p>
                  </CardHeader>
                  <CardContent>
                    <PriceLadder data={displayData} />
                  </CardContent>
                </Card>

                {/* Support & Resistance + Analysis Tabs */}
                <Card className="bg-gray-900/80 border-gray-800">
                  <Tabs defaultValue="levels" className="h-full flex flex-col">
                    <CardHeader className="pb-2">
                      <TabsList className="bg-gray-800 border border-gray-700/50">
                        <TabsTrigger value="levels" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 text-xs">
                          Support / Resistance
                        </TabsTrigger>
                        <TabsTrigger value="analysis" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 text-xs">
                          AI Analysis
                        </TabsTrigger>
                      </TabsList>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <TabsContent value="levels" className="mt-0 space-y-4">
                        {/* Resistance Levels */}
                        <div>
                          <p className="text-xs font-medium text-orange-400 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                            <HiChevronUp className="w-3.5 h-3.5" />
                            Resistance Levels
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between bg-orange-950/15 border border-orange-800/20 rounded-lg px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                                <span className="text-sm text-gray-300">Resistance 2</span>
                              </div>
                              <span className="font-mono text-sm font-semibold text-orange-300">
                                {displayData?.resistance_2 ?? 'N/A'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between bg-orange-950/10 border border-orange-800/15 rounded-lg px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-orange-300" />
                                <span className="text-sm text-gray-300">Resistance 1</span>
                              </div>
                              <span className="font-mono text-sm font-semibold text-orange-200">
                                {displayData?.resistance_1 ?? 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Current Price Marker */}
                        <div className="flex items-center gap-2 px-4">
                          <div className="flex-1 h-px bg-gray-700" />
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <RiStockLine className="w-3 h-3" />
                            CMP: {displayData?.current_price ?? 'N/A'}
                          </span>
                          <div className="flex-1 h-px bg-gray-700" />
                        </div>

                        {/* Support Levels */}
                        <div>
                          <p className="text-xs font-medium text-blue-400 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                            <HiChevronDown className="w-3.5 h-3.5" />
                            Support Levels
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between bg-blue-950/15 border border-blue-800/20 rounded-lg px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                                <span className="text-sm text-gray-300">Support 1</span>
                              </div>
                              <span className="font-mono text-sm font-semibold text-blue-300">
                                {displayData?.support_1 ?? 'N/A'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between bg-blue-950/10 border border-blue-800/15 rounded-lg px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                <span className="text-sm text-gray-300">Support 2</span>
                              </div>
                              <span className="font-mono text-sm font-semibold text-blue-400">
                                {displayData?.support_2 ?? 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="analysis" className="mt-0">
                        <ScrollArea className="h-[320px] pr-3">
                          <div className="flex items-center gap-2 mb-3">
                            <TbReportAnalytics className="w-4 h-4 text-cyan-400" />
                            <span className="text-sm font-medium text-gray-300">AI Analysis Summary</span>
                          </div>
                          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                            {renderMarkdown(displayData?.analysis_summary ?? 'No analysis available.')}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    </CardContent>
                  </Tabs>
                </Card>
              </div>

              {/* Analysis Summary - Full Width */}
              <Card className="bg-gray-900/80 border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-white flex items-center gap-2">
                    <TbReportAnalytics className="w-5 h-5 text-cyan-400" />
                    Detailed Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-800/20 rounded-lg p-4 sm:p-6 border border-gray-700/30">
                    <ScrollArea className="max-h-[400px]">
                      {renderMarkdown(displayData?.analysis_summary ?? 'No analysis available.')}
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>

              {/* Disclaimer */}
              {displayData?.disclaimer && (
                <div className="flex items-start gap-2 bg-gray-900/40 rounded-lg p-4 border border-gray-800/50">
                  <HiInformationCircle className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {displayData.disclaimer}
                  </p>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800/50 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-gray-600 text-xs">
              <RiStockLine className="w-3.5 h-3.5" />
              <span>StockPulse - AI-Powered Market Analysis</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <TbActivityHeartbeat className="w-3 h-3" />
                Agent: Stock Market Analyst
              </span>
              <span className="font-mono">{AGENT_ID.slice(0, 12)}...</span>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  )
}
