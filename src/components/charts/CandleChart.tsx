import React, { useEffect, useRef } from 'react'
// @ts-ignore - lightweight-charts type compatibility
import { createChart, CandlestickData, HistogramData } from 'lightweight-charts'

type OHLCV = { time: string | number; open: number; high: number; low: number; close: number; volume?: number }

type Props = {
  data?: OHLCV[]
}

export default function CandleChart({ data }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<any>(null)
  const candleSeriesRef = useRef<any>(null)
  const volSeriesRef = useRef<any>(null)

  useEffect(() => {
    if (!ref.current) return

    const chart = createChart(ref.current, {
      layout: { textColor: '#E2E8F0', fontSize: 12 },
      grid: { vertLines: { color: '#0E1116' }, horzLines: { color: '#0E1116' } },
      rightPriceScale: { borderColor: '#2A3441' },
      timeScale: { borderColor: '#2A3441' }
    })
    chart.applyOptions({ layout: { background: { color: '#141922' } } })
    chartRef.current = chart

    // @ts-ignore - lightweight-charts type compatibility
    const candleSeries = chart.addCandlestickSeries({ priceScaleId: 'right' })
    candleSeriesRef.current = candleSeries

    // @ts-ignore - lightweight-charts type compatibility
    const volSeries = chart.addHistogramSeries({ priceScaleId: '', scaleMargins: { top: 0.8, bottom: 0 }, color: '#3B82F6' })
    volSeriesRef.current = volSeries

    // provide sample data if none
    const sample: OHLCV[] = data && data.length ? data : generateSampleData()

    const candleData: CandlestickData[] = sample.map((d) => ({ time: d.time as any, open: d.open, high: d.high, low: d.low, close: d.close }))
    const volData: HistogramData[] = sample.map((d) => ({ time: d.time as any, value: d.volume ?? 0 }))

    candleSeries.setData(candleData)
    volSeries.setData(volData)

    chart.timeScale().fitContent()

    return () => {
      // cleanup
      try {
        chart.remove()
      } catch (e) {
        // ignore
      }
      chartRef.current = null
      candleSeriesRef.current = null
      volSeriesRef.current = null
    }
  }, [])

  return (
    <div className="border border-border rounded bg-panel p-2">
      <div ref={ref} style={{ width: '100%', height: 320 }} />
    </div>
  )
}

function generateSampleData(count = 80) {
  const out: OHLCV[] = []
  let price = 100
  for (let i = 0; i < count; i++) {
    const open = price
    const change = (Math.random() - 0.5) * 2
    const close = Math.max(0.1, open + change)
    const high = Math.max(open, close) + Math.random() * 1.5
    const low = Math.min(open, close) - Math.random() * 1.5
    const volume = Math.round(100 + Math.random() * 900)
    out.push({ time: i, open, high, low, close, volume })
    price = close
  }
  return out
}
