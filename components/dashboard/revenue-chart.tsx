'use client'

import { useState } from 'react'
import type { RevenueDataPoint, RevenueSummary } from '@/lib/types'

interface Props {
  data: RevenueDataPoint[]
  summary: RevenueSummary
}

const CHART_W = 560
const CHART_H = 140
const PAD_L = 40
const PAD_B = 24
const PAD_T = 8
const PAD_R = 8
const MAX_VAL = 80
const Y_STEPS = [0, 20, 40, 60, 80]

function plotY(val: number): number {
  return PAD_T + (CHART_H - PAD_T - PAD_B) * (1 - val / MAX_VAL)
}

interface TooltipState {
  x: number
  y: number
  total: number
  slotIndex: number
}

export default function RevenueChart({ data, summary }: Props) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const slotW = (CHART_W - PAD_L - PAD_R) / data.length
  const barGroupW = slotW * 0.75
  const barW = barGroupW / 3

  return (
    <section className="flex flex-col bg-[#161c2d] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 border-b border-white/5">
        <h2 className="text-sm font-semibold text-white">Today&apos;s Revenue Chart</h2>
        <p className="text-[11px] text-gray-500 mb-2">Today&apos;s daily revenue flow</p>

        {/* Summary row */}
        <div className="flex items-center gap-5">
          <div>
            <p className="text-[11px] text-gray-500">Court booking</p>
            <p className="text-sm font-bold text-white">${summary.courtBooking.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-500">Coaching</p>
            <p className="text-sm font-bold text-white">${summary.coaching.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-500">Pro Shop</p>
            <p className="text-sm font-bold text-[#facc15]">${summary.proShop.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="px-3 py-2 relative">
        <svg
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          className="w-full"
          style={{ height: 160 }}
          role="img"
          aria-label="Daily revenue bar chart"
          onMouseLeave={() => setTooltip(null)}
        >
          {/* Y-axis grid lines and labels */}
          {Y_STEPS.map((step) => {
            const y = plotY(step)
            return (
              <g key={step}>
                <line
                  x1={PAD_L}
                  x2={CHART_W - PAD_R}
                  y1={y}
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth={1}
                />
                <text
                  x={PAD_L - 4}
                  y={y + 4}
                  textAnchor="end"
                  fontSize={9}
                  fill="#6b7280"
                >
                  ${step}
                </text>
              </g>
            )
          })}

          {/* Bars */}
          {data.map((d, i) => {
            const slotX = PAD_L + i * slotW
            const groupX = slotX + (slotW - barGroupW) / 2
            const vals = [d.courtBooking, d.coaching, d.proShop]
            const colors = ['#3b82f6', '#06b6d4', '#facc15']
            const total = vals.reduce((s, v) => s + v, 0)

            return (
              <g
                key={d.hour}
                onMouseEnter={(e) => {
                  const rect = (e.currentTarget as SVGGElement)
                    .closest('svg')!
                    .getBoundingClientRect()
                  setTooltip({
                    x: groupX + barGroupW / 2,
                    y: plotY(Math.max(...vals)) - 8,
                    total,
                    slotIndex: i,
                  })
                }}
              >
                {vals.map((v, bi) => {
                  const bx = groupX + bi * barW
                  const bh = Math.max(2, ((CHART_H - PAD_T - PAD_B) * v) / MAX_VAL)
                  const by = CHART_H - PAD_B - bh
                  return (
                    <rect
                      key={bi}
                      x={bx + 1}
                      y={by}
                      width={barW - 2}
                      height={bh}
                      fill={colors[bi]}
                      rx={2}
                      opacity={tooltip?.slotIndex === i ? 1 : 0.8}
                    />
                  )
                })}
                {/* X-axis label */}
                <text
                  x={groupX + barGroupW / 2}
                  y={CHART_H - 6}
                  textAnchor="middle"
                  fontSize={9}
                  fill="#6b7280"
                >
                  {d.hour}
                </text>
              </g>
            )
          })}

          {/* Tooltip */}
          {tooltip && (
            <g>
              <rect
                x={Math.min(tooltip.x - 44, CHART_W - PAD_R - 90)}
                y={tooltip.y - 28}
                width={88}
                height={24}
                rx={5}
                fill="#1f2844"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={1}
              />
              <text
                x={Math.min(tooltip.x - 44, CHART_W - PAD_R - 90) + 44}
                y={tooltip.y - 11}
                textAnchor="middle"
                fontSize={9}
                fill="#facc15"
                fontWeight="600"
              >
                Today Income
              </text>
              <text
                x={Math.min(tooltip.x - 44, CHART_W - PAD_R - 90) + 44}
                y={tooltip.y - 2}
                textAnchor="middle"
                fontSize={8}
                fill="#d1d5db"
              >
                ${(tooltip.total * 38).toFixed(2)}
              </text>
            </g>
          )}
        </svg>

        {/* Legend */}
        <div className="flex items-center gap-4 px-1 pb-1">
          {[
            { color: '#3b82f6', label: 'Court Bookings' },
            { color: '#06b6d4', label: 'Coaching' },
            { color: '#facc15', label: 'Pro Shop' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
              <span className="text-[10px] text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
