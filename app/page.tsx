'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
  HiBolt,
  HiCurrencyDollar,
  HiSignal,
  HiCheckCircle,
  HiXCircle,
  HiArrowRight,
  HiNewspaper,
  HiClipboardDocumentList,
} from 'react-icons/hi2'
import {
  RiStockLine,
  RiExchangeLine,
  RiLineChartLine,
  RiPulseLine,
} from 'react-icons/ri'
import {
  TbTargetArrow,
  TbChartCandle,
  TbActivityHeartbeat,
  TbReportAnalytics,
  TbChartDots3,
  TbTrendingUp,
  TbArrowBigUpLines,
  TbArrowBigDownLines,
} from 'react-icons/tb'
import {
  BiTrendingUp,
  BiTrendingDown,
} from 'react-icons/bi'

const AGENT_ID = '699d7b98f015fb55287cbfa6'

interface StockAnalysis {
  stock_name: string
  exchange: string
  sector: string
  date: string
  timeframe: string
  current_price: string
  open_price: string
  previous_close: string
  days_high: string
  days_low: string
  week_52_high: string
  week_52_low: string
  volume: string
  average_volume: string
  volume_ratio: string
  market_cap: string
  pe_ratio: string
  change_percent: string
  ema_20: string
  ema_50: string
  vwap: string
  rsi: string
  macd_line: string
  macd_signal: string
  atr: string
  prev_day_high: string
  prev_day_low: string
  or_high: string
  or_low: string
  pivot: string
  r1: string
  r2: string
  s1: string
  s2: string
  index_trend: string
  vix: string
  market_breadth: string
  news_summary: string
  news_sentiment: string
  qoq_revenue: string
  yoy_revenue: string
  qoq_profit: string
  yoy_profit: string
  eps_change: string
  guidance_summary: string
  trend: string
  momentum: string
  market_structure: string
  key_support_levels: string
  key_resistance_levels: string
  entry_type: string
  entry_zone: string
  stop_loss: string
  target_1: string
  target_2: string
  risk_reward_ratio: string
  position_size: string
  capital_at_risk: string
  news_impact: string
  earnings_impact: string
  confidence_score: string
  final_verdict: string
  reason_summary: string
  disclaimer: string
}

const POPULAR_STOCKS = [
  'RELIANCE', 'TCS', 'INFOSYS', 'HDFC BANK', 'ICICI BANK',
  'WIPRO', 'BHARTI AIRTEL', 'ITC', 'SBIN', 'TATAMOTORS',
  'MARUTI', 'BAJFINANCE',
]

const SAMPLE_DATA: StockAnalysis = {
  stock_name: 'RELIANCE',
  exchange: 'NSE',
  sector: 'Oil & Gas / Conglomerate',
  date: '2026-02-25',
  timeframe: 'Intraday (15min)',
  current_price: '2,850.00',
  open_price: '2,840.00',
  previous_close: '2,835.00',
  days_high: '2,870.00',
  days_low: '2,830.00',
  week_52_high: '3,100.00',
  week_52_low: '2,200.00',
  volume: '12,500,000',
  average_volume: '8,000,000',
  volume_ratio: '1.56',
  market_cap: '19.3L Cr',
  pe_ratio: '28.5',
  change_percent: '+0.53%',
  ema_20: '2,842.00',
  ema_50: '2,810.00',
  vwap: '2,845.00',
  rsi: '62.5',
  macd_line: '12.5',
  macd_signal: '10.2',
  atr: '35.00',
  prev_day_high: '2,860.00',
  prev_day_low: '2,820.00',
  or_high: '2,855.00',
  or_low: '2,835.00',
  pivot: '2,838.33',
  r1: '2,856.67',
  r2: '2,878.33',
  s1: '2,816.67',
  s2: '2,798.33',
  index_trend: 'Bullish',
  vix: '13.5',
  market_breadth: '1.8 (Positive)',
  news_summary: 'Jio Platforms reports strong subscriber additions. Reliance Retail shows robust same-store sales growth. Management confirms continued capex in new energy initiatives.',
  news_sentiment: '0.45',
  qoq_revenue: '+5.2%',
  yoy_revenue: '+12.8%',
  qoq_profit: '+8.1%',
  yoy_profit: '+15.3%',
  eps_change: '+14.2%',
  guidance_summary: 'Management positive on retail and telecom growth',
  trend: 'Bullish',
  momentum: 'Strong Bullish',
  market_structure: 'Higher highs and higher lows, price above VWAP',
  key_support_levels: '2,835, 2,816, 2,798',
  key_resistance_levels: '2,857, 2,878, 2,900',
  entry_type: 'Breakout',
  entry_zone: '2,855 - 2,860',
  stop_loss: '2,820',
  target_1: '2,878',
  target_2: '2,920',
  risk_reward_ratio: '1:2.5',
  position_size: '28 shares',
  capital_at_risk: '1,000',
  news_impact: 'Bullish',
  earnings_impact: 'Positive - strong revenue and profit growth',
  confidence_score: '8',
  final_verdict: 'Buy',
  reason_summary: '- Bullish trend with 20 EMA > 50 EMA and price > VWAP\n- Strong momentum: RSI 62.5, MACD above signal\n- Volume ratio 1.56x confirms breakout validity\n- Positive news sentiment (0.45) and strong earnings\n- Risk:Reward ratio of 1:2.5 meets minimum threshold',
  disclaimer: 'This analysis is for educational purposes only. Trading involves significant risk of loss. Past performance does not guarantee future results. Always do your own research before making investment decisions.',
}

const LOADING_MESSAGES = [
  'Fetching NSE/BSE data...',
  'Analyzing technical indicators...',
  'Computing trade levels...',
  'Evaluating news & earnings impact...',
  'Generating report...',
]

function parsePrice(val: string | undefined | null): number {
  if (!val) return 0
  return parseFloat(val.replace(/[^0-9.-]/g, '')) || 0
}

function isPositiveChange(changeStr: string | undefined | null): boolean {
  if (!changeStr) return false
  return !changeStr.trim().startsWith('-')
}

function getVerdictStyle(verdict: string | undefined | null): { bg: string; text: string; border: string; shadow: string } {
  if (!verdict) return { bg: 'bg-gray-700', text: 'text-gray-200', border: 'border-gray-600', shadow: '' }
  const v = verdict.toLowerCase()
  if (v.includes('strong buy')) return { bg: 'bg-emerald-600', text: 'text-white', border: 'border-emerald-500', shadow: 'shadow-emerald-500/30' }
  if (v.includes('buy')) return { bg: 'bg-green-600', text: 'text-white', border: 'border-green-500', shadow: 'shadow-green-500/30' }
  if (v.includes('strong sell')) return { bg: 'bg-red-700', text: 'text-white', border: 'border-red-600', shadow: 'shadow-red-500/30' }
  if (v.includes('sell')) return { bg: 'bg-orange-600', text: 'text-white', border: 'border-orange-500', shadow: 'shadow-orange-500/30' }
  if (v.includes('avoid') || v.includes('hold')) return { bg: 'bg-amber-600', text: 'text-white', border: 'border-amber-500', shadow: 'shadow-amber-500/30' }
  return { bg: 'bg-gray-700', text: 'text-gray-200', border: 'border-gray-600', shadow: '' }
}

function getTrendColor(val: string | undefined | null): string {
  if (!val) return 'text-gray-400'
  const v = val.toLowerCase()
  if (v.includes('bullish') || v.includes('positive') || v.includes('strong')) return 'text-green-400'
  if (v.includes('bearish') || v.includes('negative') || v.includes('weak')) return 'text-red-400'
  return 'text-amber-400'
}

function getTrendBg(val: string | undefined | null): string {
  if (!val) return 'bg-gray-800 border-gray-700'
  const v = val.toLowerCase()
  if (v.includes('bullish') || v.includes('positive') || v.includes('strong')) return 'bg-green-950/30 border-green-800/40'
  if (v.includes('bearish') || v.includes('negative') || v.includes('weak')) return 'bg-red-950/30 border-red-800/40'
  return 'bg-amber-950/30 border-amber-800/40'
}

function getImpactColor(val: string | undefined | null): string {
  if (!val) return 'text-gray-400'
  const v = val.toLowerCase()
  if (v.includes('bullish') || v.includes('positive')) return 'text-green-400'
  if (v.includes('bearish') || v.includes('negative')) return 'text-red-400'
  if (v.includes('neutral')) return 'text-amber-400'
  return 'text-gray-300'
}

function getVixColor(vixStr: string | undefined | null): string {
  const v = parseFloat(vixStr?.replace(/[^0-9.-]/g, '') || '0')
  if (v === 0) return 'text-gray-400'
  if (v < 15) return 'text-green-400'
  if (v <= 20) return 'text-amber-400'
  return 'text-red-400'
}

function getVixLabel(vixStr: string | undefined | null): string {
  const v = parseFloat(vixStr?.replace(/[^0-9.-]/g, '') || '0')
  if (v === 0) return ''
  if (v < 15) return 'Low Volatility'
  if (v <= 20) return 'Moderate'
  return 'High Volatility'
}

function getRsiColor(rsiStr: string | undefined | null): string {
  const r = parseFloat(rsiStr?.replace(/[^0-9.-]/g, '') || '0')
  if (r === 0) return 'text-gray-400'
  if (r < 30) return 'text-red-400'
  if (r > 70) return 'text-red-400'
  if (r >= 45 && r <= 55) return 'text-amber-400'
  return 'text-green-400'
}

function getRsiLabel(rsiStr: string | undefined | null): string {
  const r = parseFloat(rsiStr?.replace(/[^0-9.-]/g, '') || '0')
  if (r === 0) return ''
  if (r < 30) return 'Oversold'
  if (r > 70) return 'Overbought'
  if (r >= 45 && r <= 55) return 'Neutral Zone'
  if (r < 45) return 'Weak'
  return 'Bullish'
}

function getRsiBarWidth(rsiStr: string | undefined | null): number {
  const r = parseFloat(rsiStr?.replace(/[^0-9.-]/g, '') || '0')
  return Math.min(100, Math.max(0, r))
}

function getRsiBarColor(rsiStr: string | undefined | null): string {
  const r = parseFloat(rsiStr?.replace(/[^0-9.-]/g, '') || '0')
  if (r < 30) return 'bg-red-500'
  if (r > 70) return 'bg-red-500'
  if (r >= 45 && r <= 55) return 'bg-amber-500'
  return 'bg-green-500'
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

function LoadingPulse({ messageIndex }: { messageIndex: number }) {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3 mb-6">
        <RiPulseLine className="w-6 h-6 text-cyan-400 animate-pulse" />
        <span className="text-cyan-400 text-lg font-medium animate-pulse">
          {LOADING_MESSAGES[messageIndex % LOADING_MESSAGES.length]}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((n) => (
          <div key={n} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <div className="animate-pulse space-y-3">
              <div className="h-5 bg-gray-700 rounded w-1/3" />
              <div className="h-24 bg-gray-700 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-gray-700 rounded w-1/4" />
          <div className="h-40 bg-gray-700 rounded w-full" />
        </div>
      </div>
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
        <div className="absolute h-2 rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-green-500" style={{ width: '100%' }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-cyan-400 shadow-lg shadow-cyan-400/30" style={{ left: `calc(${pct}% - 7px)` }} />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1.5">
        <span>52W Low: {low || 'N/A'}</span>
        <span className="text-cyan-400 font-mono text-xs">{current || ''}</span>
        <span>52W High: {high || 'N/A'}</span>
      </div>
    </div>
  )
}

function ConfidenceGauge({ score }: { score: string | undefined | null }) {
  const val = parseInt(score?.replace(/[^0-9]/g, '') || '0', 10)
  const clampedVal = Math.min(10, Math.max(0, val))
  const pct = (clampedVal / 10) * 100

  let gaugeColor = 'bg-red-500'
  let textColor = 'text-red-400'
  if (clampedVal >= 7) { gaugeColor = 'bg-green-500'; textColor = 'text-green-400' }
  else if (clampedVal >= 5) { gaugeColor = 'bg-amber-500'; textColor = 'text-amber-400' }
  else if (clampedVal >= 3) { gaugeColor = 'bg-orange-500'; textColor = 'text-orange-400' }

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">Confidence</span>
          <span className={`text-sm font-bold font-mono ${textColor}`}>{clampedVal}/10</span>
        </div>
        <div className="h-2 rounded-full bg-gray-700 overflow-hidden">
          <div className={`h-full rounded-full ${gaugeColor} transition-all duration-500`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  )
}

function PriceLadder({ data }: { data: StockAnalysis }) {
  const currentVal = parsePrice(data?.current_price)

  const levels = [
    { label: 'Target 2', value: data?.target_2, color: 'bg-emerald-500', textColor: 'text-emerald-400', borderColor: 'border-emerald-500/40' },
    { label: 'Target 1', value: data?.target_1, color: 'bg-green-500', textColor: 'text-green-400', borderColor: 'border-green-500/40' },
    { label: 'Entry Zone', value: data?.entry_zone, color: 'bg-cyan-400', textColor: 'text-cyan-300', borderColor: 'border-cyan-400/50' },
    { label: 'Stop Loss', value: data?.stop_loss, color: 'bg-red-500', textColor: 'text-red-400', borderColor: 'border-red-500/40' },
  ]

  return (
    <div className="space-y-2">
      {levels.map((level, idx) => {
        const priceVal = parsePrice(level.value)
        let pctDiff = ''
        if (currentVal > 0 && priceVal > 0) {
          const diff = ((priceVal - currentVal) / currentVal) * 100
          pctDiff = `${diff >= 0 ? '+' : ''}${diff.toFixed(2)}%`
        }

        const isEntry = level.label === 'Entry Zone'
        const isStopLoss = level.label === 'Stop Loss'
        const isTarget = level.label.startsWith('Target')

        return (
          <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${level.borderColor} bg-gray-800/40 hover:bg-gray-800/60`}>
            <div className={`w-3 h-3 rounded-full ${level.color} shrink-0`} />
            <div className="flex-1 min-w-0">
              <span className={`text-xs font-medium ${level.textColor}`}>{level.label}</span>
            </div>
            <div className="text-right flex items-center gap-2">
              <span className={`font-mono text-sm font-semibold ${level.textColor}`}>{level.value || 'N/A'}</span>
              {pctDiff && (
                <span className={`text-xs font-mono ${pctDiff.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>({pctDiff})</span>
              )}
            </div>
            <div className="w-5 flex justify-center">
              {isTarget && <HiChevronUp className="w-4 h-4 text-green-400" />}
              {isStopLoss && <HiShieldCheck className="w-4 h-4 text-red-400" />}
              {isEntry && <TbTargetArrow className="w-4 h-4 text-cyan-400" />}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DataCell({ label, value, valueColor }: { label: string; value: string | undefined | null; valueColor?: string }) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`font-mono text-sm font-medium ${valueColor || 'text-gray-200'}`}>{value || 'N/A'}</p>
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
  const [capital, setCapital] = useState('100000')
  const [riskPercent, setRiskPercent] = useState('1')
  const [maxTrades, setMaxTrades] = useState('3')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<StockAnalysis | null>(null)
  const [error, setError] = useState('')
  const [showSample, setShowSample] = useState(false)
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0)
  const loadingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const displayData = showSample ? SAMPLE_DATA : result

  useEffect(() => {
    if (loading) {
      setLoadingMsgIdx(0)
      loadingIntervalRef.current = setInterval(() => {
        setLoadingMsgIdx(prev => (prev + 1) % LOADING_MESSAGES.length)
      }, 2500)
    } else {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current)
        loadingIntervalRef.current = null
      }
    }
    return () => {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current)
      }
    }
  }, [loading])

  const extractStockData = useCallback((response: any): StockAnalysis | null => {
    if (!response) return null

    // Helper: check if an object looks like valid stock analysis data
    const isStockData = (obj: any): boolean => {
      if (!obj || typeof obj !== 'object') return false
      // Check for at least a few key fields that should always be present
      const keyFields = ['stock_name', 'current_price', 'final_verdict', 'trend', 'stop_loss']
      const matchCount = keyFields.filter(f => f in obj && obj[f]).length
      return matchCount >= 2
    }

    // Helper: try to parse a string as JSON and check if it's stock data
    const tryParseAndCheck = (str: string): StockAnalysis | null => {
      if (!str || typeof str !== 'string') return null
      try {
        const parsed = JSON.parse(str)
        if (isStockData(parsed)) return parsed as StockAnalysis
        // Check nested keys
        if (parsed?.result && isStockData(parsed.result)) return parsed.result as StockAnalysis
        if (parsed?.response?.result && isStockData(parsed.response.result)) return parsed.response.result as StockAnalysis
        if (parsed?.data && isStockData(parsed.data)) return parsed.data as StockAnalysis
      } catch {
        // Try extracting JSON from text
        const jsonMatch = str.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          try {
            const extracted = JSON.parse(jsonMatch[0])
            if (isStockData(extracted)) return extracted as StockAnalysis
          } catch {}
        }
      }
      return null
    }

    // Path 1: Direct response.result (standard JSON agent response)
    const directResult = response?.response?.result
    if (isStockData(directResult)) return directResult as StockAnalysis

    // Path 2: response.result might be nested further
    if (directResult?.result && isStockData(directResult.result)) return directResult.result as StockAnalysis

    // Path 3: response.result might contain a text/message field with JSON string
    if (directResult?.text) {
      const fromText = tryParseAndCheck(directResult.text)
      if (fromText) return fromText
    }
    if (directResult?.message && typeof directResult.message === 'string') {
      const fromMsg = tryParseAndCheck(directResult.message)
      if (fromMsg) return fromMsg
    }

    // Path 4: response itself might have the data
    if (isStockData(response?.response)) return response.response as StockAnalysis

    // Path 5: response.message might be a JSON string
    if (response?.response?.message && typeof response.response.message === 'string') {
      const fromRespMsg = tryParseAndCheck(response.response.message)
      if (fromRespMsg) return fromRespMsg
    }

    // Path 6: Check raw_response
    if (response?.raw_response) {
      const fromRaw = tryParseAndCheck(response.raw_response)
      if (fromRaw) return fromRaw
    }

    // Path 7: The entire response object at top level
    if (isStockData(response)) return response as StockAnalysis

    // Path 8: Fallback — if directResult has some stock fields, use it as-is
    if (directResult && typeof directResult === 'object' && Object.keys(directResult).length > 5) {
      return directResult as StockAnalysis
    }

    return null
  }, [])

  const analyzeStock = useCallback(async (stockName: string) => {
    if (!stockName.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const message = `Analyze the stock ${stockName} for intraday trading. Capital: ${capital} INR, Risk per trade: ${riskPercent}%, Max trades today: ${maxTrades}. Provide complete Trade Decision Report with all technical indicators, pivot levels, support/resistance, entry/exit levels, position sizing, news analysis, earnings data, and final verdict.`
      const response = await callAIAgent(message, AGENT_ID)
      if (response?.success) {
        const data = extractStockData(response)
        if (data) {
          setResult(data)
        } else {
          setError('Received response but could not extract stock analysis data. Please try again.')
        }
      } else {
        setError(response?.error || response?.response?.message || 'Failed to analyze stock.')
      }
    } catch (err) {
      setError('Failed to analyze stock. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }, [capital, riskPercent, maxTrades, extractStockData])

  const handleSearch = useCallback(() => {
    setShowSample(false)
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

  const parseLevels = (str: string | undefined | null): string[] => {
    if (!str) return []
    return str.split(',').map(s => s.trim()).filter(s => s.length > 0)
  }

  const parseReasons = (str: string | undefined | null): string[] => {
    if (!str) return []
    return str.split('\n').map(s => s.trim()).filter(s => s.startsWith('-')).map(s => s.slice(1).trim())
  }

  const volRatio = parseFloat(displayData?.volume_ratio?.replace(/[^0-9.-]/g, '') || '0')
  const ema20Val = parsePrice(displayData?.ema_20)
  const ema50Val = parsePrice(displayData?.ema_50)
  const macdLineVal = parseFloat(displayData?.macd_line?.replace(/[^0-9.-]/g, '') || '0')
  const macdSignalVal = parseFloat(displayData?.macd_signal?.replace(/[^0-9.-]/g, '') || '0')
  const currentPriceVal = parsePrice(displayData?.current_price)
  const vwapVal = parsePrice(displayData?.vwap)
  const sentimentVal = parseFloat(displayData?.news_sentiment?.replace(/[^0-9.+-]/g, '') || '0')

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-950 text-gray-100">
        {/* Header */}
        <header className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 border-b border-gray-800">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 via-transparent to-blue-900/10" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  <RiStockLine className="w-7 h-7 text-cyan-400" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    StockPulse Pro
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-400">
                    Professional Intraday Trading Analyst
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">Sample Data</span>
                <button
                  onClick={() => {
                    setShowSample(!showSample)
                    if (!showSample) setError('')
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showSample ? 'bg-cyan-600' : 'bg-gray-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showSample ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Search & Config Section */}
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

              {/* Config Fields */}
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Capital (INR)</label>
                  <Input
                    value={capital}
                    onChange={(e) => setCapital(e.target.value)}
                    placeholder="100000"
                    className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 h-9 text-sm font-mono focus:border-cyan-500 focus:ring-cyan-500/20"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Risk per Trade (%)</label>
                  <Input
                    value={riskPercent}
                    onChange={(e) => setRiskPercent(e.target.value)}
                    placeholder="1"
                    className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 h-9 text-sm font-mono focus:border-cyan-500 focus:ring-cyan-500/20"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Max Trades</label>
                  <Input
                    value={maxTrades}
                    onChange={(e) => setMaxTrades(e.target.value)}
                    placeholder="3"
                    className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 h-9 text-sm font-mono focus:border-cyan-500 focus:ring-cyan-500/20"
                  />
                </div>
              </div>

              {/* Popular Stocks */}
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1.5">
                  <HiBolt className="w-3.5 h-3.5" />
                  Quick Access
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
          {loading && !showSample && <LoadingPulse messageIndex={loadingMsgIdx} />}

          {/* Empty State */}
          {!loading && !displayData && !error && (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
              <div className="p-4 bg-gray-800/50 rounded-2xl border border-gray-700/50 mb-6">
                <TbChartCandle className="w-14 h-14 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                Ready to Generate Trade Report
              </h3>
              <p className="text-sm text-gray-500 max-w-lg mb-8">
                Enter any NSE or BSE listed stock above to get a comprehensive Trade Decision Report with technical analysis, entry/exit levels, position sizing, and AI confidence scoring.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl">
                {[
                  { label: 'Real-time NSE/BSE Data', icon: <RiStockLine className="w-4 h-4 text-cyan-500" /> },
                  { label: 'EMA, RSI, MACD, VWAP', icon: <TbChartDots3 className="w-4 h-4 text-cyan-500" /> },
                  { label: 'Target & Stop Loss', icon: <TbTargetArrow className="w-4 h-4 text-cyan-500" /> },
                  { label: 'Position Sizing & Risk', icon: <HiShieldCheck className="w-4 h-4 text-cyan-500" /> },
                  { label: 'News & Earnings', icon: <HiNewspaper className="w-4 h-4 text-cyan-500" /> },
                  { label: 'AI Confidence Score', icon: <HiSignal className="w-4 h-4 text-cyan-500" /> },
                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-2 text-xs text-gray-400 bg-gray-800/40 rounded-lg px-3 py-2.5 border border-gray-700/30">
                    {f.icon}
                    {f.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============== RESULTS DASHBOARD ============== */}
          {displayData && !loading && (
            <div className="space-y-6">

              {/* ROW 1: Verdict Banner */}
              <div className={`rounded-xl border-2 p-4 sm:p-6 ${getVerdictStyle(displayData?.final_verdict).border} ${getVerdictStyle(displayData?.final_verdict).shadow} shadow-lg bg-gray-900/90`}>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl ${getVerdictStyle(displayData?.final_verdict).bg} ${getVerdictStyle(displayData?.final_verdict).text} font-bold text-xl shadow-lg`}>
                      {displayData?.final_verdict?.toLowerCase().includes('buy') ? (
                        <HiArrowTrendingUp className="w-6 h-6" />
                      ) : displayData?.final_verdict?.toLowerCase().includes('sell') ? (
                        <HiArrowTrendingDown className="w-6 h-6" />
                      ) : (
                        <HiMinus className="w-6 h-6" />
                      )}
                      {displayData?.final_verdict ?? 'N/A'}
                    </div>
                    <Badge className={`${getTrendBg(displayData?.trend)} ${getTrendColor(displayData?.trend)} border text-xs px-3 py-1`}>
                      {displayData?.trend ?? 'N/A'}
                    </Badge>
                    <Badge className={`${getTrendBg(displayData?.momentum)} ${getTrendColor(displayData?.momentum)} border text-xs px-3 py-1`}>
                      {displayData?.momentum ?? 'N/A'}
                    </Badge>
                    <Badge className="bg-cyan-950/30 border-cyan-800/40 text-cyan-300 border text-xs px-3 py-1">
                      {displayData?.entry_type ?? 'N/A'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-48">
                      <ConfidenceGauge score={displayData?.confidence_score} />
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-gray-500">{displayData?.date ?? ''}</p>
                      <p className="text-xs text-gray-500">{displayData?.timeframe ?? ''}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ROW 2: Stock Overview + Market Context */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stock Overview (2/3) */}
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
                          <p className="text-sm text-gray-500 mt-1">{displayData?.sector ?? 'N/A'}</p>
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
                            <span className={`text-lg font-semibold font-mono ${isPositiveChange(displayData?.change_percent) ? 'text-green-400' : 'text-red-400'}`}>
                              {displayData?.change_percent ?? 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* OHLC Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <DataCell label="Open" value={displayData?.open_price} />
                        <DataCell label="Prev Close" value={displayData?.previous_close} />
                        <DataCell label="Day High" value={displayData?.days_high} valueColor="text-green-400" />
                        <DataCell label="Day Low" value={displayData?.days_low} valueColor="text-red-400" />
                      </div>

                      {/* Volume & Fundamental */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <DataCell label="Volume" value={displayData?.volume} />
                        <DataCell label="Avg Volume" value={displayData?.average_volume} />
                        <DataCell label="Vol Ratio" value={displayData?.volume_ratio} valueColor={volRatio > 1.5 ? 'text-green-400' : 'text-gray-200'} />
                        <DataCell label="Market Cap" value={displayData?.market_cap} />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <DataCell label="P/E Ratio" value={displayData?.pe_ratio} />
                        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
                          <p className="text-xs text-gray-500 mb-1">Volume Breakout</p>
                          <div className="flex items-center gap-2">
                            {volRatio > 1.5 ? (
                              <>
                                <HiCheckCircle className="w-4 h-4 text-green-400" />
                                <span className="text-sm font-medium text-green-400">Confirmed ({displayData?.volume_ratio}x)</span>
                              </>
                            ) : (
                              <>
                                <HiXCircle className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-400">Not confirmed ({displayData?.volume_ratio ?? 'N/A'}x)</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 52 Week Range */}
                      <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                        <p className="text-xs text-gray-500 mb-2 flex items-center gap-1.5">
                          <RiExchangeLine className="w-3.5 h-3.5" />
                          52-Week Range
                        </p>
                        <Week52RangeBar low={displayData?.week_52_low ?? ''} high={displayData?.week_52_high ?? ''} current={displayData?.current_price ?? ''} />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Market Context (1/3) */}
                <div className="lg:col-span-1">
                  <Card className="bg-gray-900/80 border-gray-800 h-full">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                        <HiSignal className="w-4 h-4 text-cyan-400" />
                        Market Context
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Index Trend */}
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-400">Index Trend</span>
                        <div className="flex items-center gap-2">
                          {displayData?.index_trend?.toLowerCase().includes('bullish') ? (
                            <HiArrowTrendingUp className="w-4 h-4 text-green-400" />
                          ) : displayData?.index_trend?.toLowerCase().includes('bearish') ? (
                            <HiArrowTrendingDown className="w-4 h-4 text-red-400" />
                          ) : (
                            <HiMinus className="w-4 h-4 text-amber-400" />
                          )}
                          <span className={`text-sm font-medium ${getTrendColor(displayData?.index_trend)}`}>
                            {displayData?.index_trend ?? 'N/A'}
                          </span>
                        </div>
                      </div>

                      <Separator className="bg-gray-800" />

                      {/* VIX */}
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-400">India VIX</span>
                        <div className="text-right">
                          <span className={`text-sm font-mono font-semibold ${getVixColor(displayData?.vix)}`}>
                            {displayData?.vix ?? 'N/A'}
                          </span>
                          {displayData?.vix && (
                            <p className={`text-xs ${getVixColor(displayData?.vix)}`}>{getVixLabel(displayData?.vix)}</p>
                          )}
                        </div>
                      </div>

                      <Separator className="bg-gray-800" />

                      {/* Market Breadth */}
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-400">Market Breadth</span>
                        <span className="text-sm text-gray-200 font-medium">{displayData?.market_breadth ?? 'N/A'}</span>
                      </div>

                      <Separator className="bg-gray-800" />

                      {/* News Impact */}
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-400">News Impact</span>
                        <Badge className={`${getTrendBg(displayData?.news_impact)} ${getImpactColor(displayData?.news_impact)} border text-xs`}>
                          {displayData?.news_impact ?? 'N/A'}
                        </Badge>
                      </div>

                      <Separator className="bg-gray-800" />

                      {/* Earnings Impact */}
                      <div className="py-2">
                        <span className="text-sm text-gray-400 block mb-1">Earnings Impact</span>
                        <p className={`text-sm ${getImpactColor(displayData?.earnings_impact)}`}>
                          {displayData?.earnings_impact ?? 'N/A'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* ROW 3: Technical Indicators + Pivot Levels */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Technical Indicators */}
                <Card className="bg-gray-900/80 border-gray-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-white flex items-center gap-2">
                      <TbChartDots3 className="w-5 h-5 text-cyan-400" />
                      Technical Indicators
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* EMA Section */}
                    <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Exponential Moving Averages</span>
                        <Badge className={`text-xs border ${ema20Val > ema50Val ? 'bg-green-950/30 border-green-800/40 text-green-400' : ema20Val < ema50Val ? 'bg-red-950/30 border-red-800/40 text-red-400' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
                          {ema20Val > ema50Val ? 'Bullish Cross' : ema20Val < ema50Val ? 'Bearish Cross' : '--'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">EMA 20</span>
                          <span className="font-mono text-sm font-medium text-gray-200">{displayData?.ema_20 ?? 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">EMA 50</span>
                          <span className="font-mono text-sm font-medium text-gray-200">{displayData?.ema_50 ?? 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* VWAP */}
                    <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">VWAP</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium text-gray-200">{displayData?.vwap ?? 'N/A'}</span>
                          {currentPriceVal > 0 && vwapVal > 0 && (
                            <Badge className={`text-xs border ${currentPriceVal > vwapVal ? 'bg-green-950/30 border-green-800/40 text-green-400' : 'bg-red-950/30 border-red-800/40 text-red-400'}`}>
                              Price {currentPriceVal > vwapVal ? 'Above' : 'Below'} VWAP
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* RSI */}
                    <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">RSI (14)</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-sm font-bold ${getRsiColor(displayData?.rsi)}`}>
                            {displayData?.rsi ?? 'N/A'}
                          </span>
                          <span className={`text-xs ${getRsiColor(displayData?.rsi)}`}>{getRsiLabel(displayData?.rsi)}</span>
                        </div>
                      </div>
                      <div className="relative h-2.5 rounded-full bg-gray-700 overflow-hidden">
                        <div className={`h-full rounded-full ${getRsiBarColor(displayData?.rsi)} transition-all duration-500`} style={{ width: `${getRsiBarWidth(displayData?.rsi)}%` }} />
                        {/* Markers at 30 and 70 */}
                        <div className="absolute top-0 bottom-0 w-px bg-gray-500/50" style={{ left: '30%' }} />
                        <div className="absolute top-0 bottom-0 w-px bg-gray-500/50" style={{ left: '70%' }} />
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 mt-1">
                        <span>0</span>
                        <span>30</span>
                        <span>50</span>
                        <span>70</span>
                        <span>100</span>
                      </div>
                    </div>

                    {/* MACD */}
                    <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">MACD</span>
                        <Badge className={`text-xs border ${macdLineVal > macdSignalVal ? 'bg-green-950/30 border-green-800/40 text-green-400' : macdLineVal < macdSignalVal ? 'bg-red-950/30 border-red-800/40 text-red-400' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
                          {macdLineVal > macdSignalVal ? 'Bullish' : macdLineVal < macdSignalVal ? 'Bearish' : '--'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Line</span>
                          <span className="font-mono text-sm font-medium text-gray-200">{displayData?.macd_line ?? 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Signal</span>
                          <span className="font-mono text-sm font-medium text-gray-200">{displayData?.macd_signal ?? 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* ATR */}
                    <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">ATR (Average True Range)</span>
                        <span className="font-mono text-sm font-medium text-gray-200">{displayData?.atr ?? 'N/A'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pivot & Range Levels */}
                <Card className="bg-gray-900/80 border-gray-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-white flex items-center gap-2">
                      <TbChartCandle className="w-5 h-5 text-cyan-400" />
                      Pivot & Range Levels
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Resistance Levels */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-red-950/15 border border-red-800/20 rounded-lg px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <TbArrowBigUpLines className="w-4 h-4 text-red-400" />
                          <span className="text-sm text-gray-300">R2</span>
                        </div>
                        <span className="font-mono text-sm font-semibold text-red-300">{displayData?.r2 ?? 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between bg-orange-950/15 border border-orange-800/20 rounded-lg px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <HiChevronUp className="w-4 h-4 text-orange-400" />
                          <span className="text-sm text-gray-300">R1</span>
                        </div>
                        <span className="font-mono text-sm font-semibold text-orange-300">{displayData?.r1 ?? 'N/A'}</span>
                      </div>
                    </div>

                    {/* Pivot Center */}
                    <div className="flex items-center justify-between bg-gray-800/50 border border-gray-600/30 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                        <span className="text-sm text-white font-medium">Pivot</span>
                      </div>
                      <span className="font-mono text-sm font-bold text-white">{displayData?.pivot ?? 'N/A'}</span>
                    </div>

                    {/* Support Levels */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-cyan-950/15 border border-cyan-800/20 rounded-lg px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <HiChevronDown className="w-4 h-4 text-cyan-400" />
                          <span className="text-sm text-gray-300">S1</span>
                        </div>
                        <span className="font-mono text-sm font-semibold text-cyan-300">{displayData?.s1 ?? 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between bg-blue-950/15 border border-blue-800/20 rounded-lg px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <TbArrowBigDownLines className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-gray-300">S2</span>
                        </div>
                        <span className="font-mono text-sm font-semibold text-blue-300">{displayData?.s2 ?? 'N/A'}</span>
                      </div>
                    </div>

                    <Separator className="bg-gray-800" />

                    {/* Previous Day Range */}
                    <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">Previous Day Range</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">High</span>
                          <span className="font-mono text-sm text-green-400">{displayData?.prev_day_high ?? 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Low</span>
                          <span className="font-mono text-sm text-red-400">{displayData?.prev_day_low ?? 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Opening Range */}
                    <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">Opening Range</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">OR High</span>
                          <span className="font-mono text-sm text-green-400">{displayData?.or_high ?? 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">OR Low</span>
                          <span className="font-mono text-sm text-red-400">{displayData?.or_low ?? 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* ROW 4: TRADE DECISION REPORT - PRIMARY FEATURE */}
              <Card className="bg-gray-900/80 border-gray-800 border-l-4 border-l-cyan-500 shadow-lg shadow-cyan-900/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <TbReportAnalytics className="w-6 h-6 text-cyan-400" />
                    TRADE DECISION REPORT
                  </CardTitle>
                  <p className="text-xs text-gray-500 mt-1">
                    Complete trade setup with entry, targets, stop loss, and position sizing
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Trade Setup */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                        <TbTargetArrow className="w-4 h-4 text-cyan-400" />
                        Trade Setup
                      </h4>

                      {/* Entry Type */}
                      <div className="bg-gray-800/40 rounded-lg p-3 border border-gray-700/30">
                        <span className="text-xs text-gray-500">Entry Type</span>
                        <p className="text-sm font-semibold text-cyan-300 mt-0.5">{displayData?.entry_type ?? 'N/A'}</p>
                      </div>

                      {/* Price Ladder */}
                      <PriceLadder data={displayData} />

                      {/* Risk Reward Ratio - Prominent */}
                      <div className="bg-cyan-950/20 border border-cyan-800/30 rounded-lg p-4 text-center">
                        <span className="text-xs text-cyan-400/70 uppercase tracking-wider block mb-1">Risk : Reward</span>
                        <span className="text-2xl font-bold font-mono text-cyan-300">
                          {displayData?.risk_reward_ratio ?? 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Right: Position Sizing */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                        <HiCurrencyDollar className="w-4 h-4 text-cyan-400" />
                        Position Sizing
                      </h4>

                      <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/30 space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                          <span className="text-sm text-gray-400">Position Size</span>
                          <span className="font-mono text-lg font-bold text-white">{displayData?.position_size ?? 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                          <span className="text-sm text-gray-400">Capital at Risk</span>
                          <span className="font-mono text-lg font-bold text-red-400">{displayData?.capital_at_risk ?? 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                          <span className="text-sm text-gray-400">Entry Zone</span>
                          <span className="font-mono text-sm font-semibold text-cyan-300">{displayData?.entry_zone ?? 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                          <span className="text-sm text-gray-400 flex items-center gap-1.5">
                            <HiShieldCheck className="w-3.5 h-3.5 text-red-400" />
                            Stop Loss
                          </span>
                          <span className="font-mono text-sm font-semibold text-red-400">{displayData?.stop_loss ?? 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                          <span className="text-sm text-gray-400">Target 1</span>
                          <span className="font-mono text-sm font-semibold text-green-400">{displayData?.target_1 ?? 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm text-gray-400">Target 2</span>
                          <span className="font-mono text-sm font-semibold text-emerald-400">{displayData?.target_2 ?? 'N/A'}</span>
                        </div>
                      </div>

                      {/* Capital Allocation Visual */}
                      <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/30">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Capital Allocation</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">Total Capital</span>
                            <span className="font-mono text-gray-200">{capital} INR</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">Risk Budget ({riskPercent}%)</span>
                            <span className="font-mono text-amber-400">{(parseFloat(capital || '0') * parseFloat(riskPercent || '0') / 100).toLocaleString()} INR</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">Capital at Risk</span>
                            <span className="font-mono text-red-400">{displayData?.capital_at_risk ?? 'N/A'} INR</span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-700 overflow-hidden mt-2">
                            {(() => {
                              const totalCap = parseFloat(capital || '0')
                              const riskCap = parsePrice(displayData?.capital_at_risk)
                              const pctUsed = totalCap > 0 ? Math.min(100, (riskCap / totalCap) * 100) : 0
                              return <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-red-500 transition-all" style={{ width: `${pctUsed}%` }} />
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ROW 5: Support / Resistance Key Levels */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Key Support Levels */}
                <Card className="bg-gray-900/80 border-gray-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-cyan-400 flex items-center gap-2 uppercase tracking-wider">
                      <HiChevronDown className="w-4 h-4" />
                      Key Support Levels
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {parseLevels(displayData?.key_support_levels).length > 0 ? (
                        parseLevels(displayData?.key_support_levels).map((level, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-cyan-950/15 border border-cyan-800/20 rounded-lg px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                              <span className="text-sm text-gray-300">Support {idx + 1}</span>
                            </div>
                            <span className="font-mono text-sm font-semibold text-cyan-300">{level}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">No support levels available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Key Resistance Levels */}
                <Card className="bg-gray-900/80 border-gray-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-orange-400 flex items-center gap-2 uppercase tracking-wider">
                      <HiChevronUp className="w-4 h-4" />
                      Key Resistance Levels
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {parseLevels(displayData?.key_resistance_levels).length > 0 ? (
                        parseLevels(displayData?.key_resistance_levels).map((level, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-orange-950/15 border border-orange-800/20 rounded-lg px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                              <span className="text-sm text-gray-300">Resistance {idx + 1}</span>
                            </div>
                            <span className="font-mono text-sm font-semibold text-orange-300">{level}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">No resistance levels available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* ROW 6: Market Structure + News & Earnings */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Market Structure */}
                <Card className="bg-gray-900/80 border-gray-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-white flex items-center gap-2">
                      <TbTrendingUp className="w-5 h-5 text-cyan-400" />
                      Market Structure
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {displayData?.market_structure ?? 'N/A'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className={`rounded-lg p-3 border ${getTrendBg(displayData?.trend)}`}>
                        <span className="text-xs text-gray-500 block mb-1">Trend</span>
                        <span className={`text-sm font-semibold ${getTrendColor(displayData?.trend)}`}>
                          {displayData?.trend ?? 'N/A'}
                        </span>
                      </div>
                      <div className={`rounded-lg p-3 border ${getTrendBg(displayData?.momentum)}`}>
                        <span className="text-xs text-gray-500 block mb-1">Momentum</span>
                        <span className={`text-sm font-semibold ${getTrendColor(displayData?.momentum)}`}>
                          {displayData?.momentum ?? 'N/A'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* News & Earnings */}
                <Card className="bg-gray-900/80 border-gray-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-white flex items-center gap-2">
                      <HiNewspaper className="w-5 h-5 text-cyan-400" />
                      News & Earnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* News Summary */}
                    <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">News</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Sentiment:</span>
                          <span className={`font-mono text-xs font-semibold ${sentimentVal > 0 ? 'text-green-400' : sentimentVal < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                            {displayData?.news_sentiment ?? 'N/A'}
                          </span>
                          {displayData?.news_sentiment && (
                            <div className="w-16 h-1.5 rounded-full bg-gray-700 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${sentimentVal > 0 ? 'bg-green-500' : sentimentVal < 0 ? 'bg-red-500' : 'bg-gray-500'}`}
                                style={{ width: `${Math.min(100, Math.abs(sentimentVal) * 100)}%`, marginLeft: sentimentVal < 0 ? 'auto' : '0' }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {displayData?.news_summary ?? 'N/A'}
                      </p>
                    </div>

                    {/* Earnings Grid */}
                    <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                      <span className="text-xs text-gray-500 uppercase tracking-wider font-medium block mb-2">Earnings</span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          { label: 'QoQ Rev', value: displayData?.qoq_revenue },
                          { label: 'YoY Rev', value: displayData?.yoy_revenue },
                          { label: 'QoQ Profit', value: displayData?.qoq_profit },
                          { label: 'YoY Profit', value: displayData?.yoy_profit },
                          { label: 'EPS Change', value: displayData?.eps_change },
                        ].map((item) => (
                          <div key={item.label} className="bg-gray-800/50 rounded p-2 border border-gray-700/30">
                            <span className="text-xs text-gray-500 block">{item.label}</span>
                            <span className={`font-mono text-sm font-medium ${isPositiveChange(item.value) ? 'text-green-400' : 'text-red-400'}`}>
                              {item.value ?? 'N/A'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Guidance */}
                    {displayData?.guidance_summary && (
                      <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-medium block mb-1">Guidance</span>
                        <p className="text-sm text-gray-300">{displayData.guidance_summary}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* ROW 7: Reason Summary */}
              <Card className="bg-gray-900/80 border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-white flex items-center gap-2">
                    <HiClipboardDocumentList className="w-5 h-5 text-cyan-400" />
                    Analysis Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {parseReasons(displayData?.reason_summary).length > 0 ? (
                      parseReasons(displayData?.reason_summary).map((reason, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-gray-800/30 rounded-lg p-3 border border-gray-700/20">
                          <HiArrowRight className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                          <p className="text-sm text-gray-300">{reason}</p>
                        </div>
                      ))
                    ) : displayData?.reason_summary ? (
                      <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/20">
                        {renderMarkdown(displayData.reason_summary)}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">No summary available</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* ROW 8: Disclaimer */}
              {displayData?.disclaimer && (
                <div className="flex items-start gap-2 bg-gray-900/40 rounded-lg p-4 border border-gray-800/50">
                  <HiExclamationTriangle className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
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
              <span>StockPulse Pro - Professional Intraday Trading Analyst</span>
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
