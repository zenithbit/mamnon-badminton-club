'use client'

import { useEffect, useRef, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  id?: string
  name: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

function toDate(iso: string): Date | undefined {
  if (!iso) return undefined
  const d = new Date(iso + 'T00:00:00')
  return isNaN(d.getTime()) ? undefined : d
}

function toISO(date: Date): string {
  return date.toLocaleDateString('en-CA') // YYYY-MM-DD
}

export default function DatePicker({ id, name, value, onChange, placeholder = 'Chọn ngày' }: Props) {
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState<Date>(toDate(value) ?? new Date())
  const containerRef = useRef<HTMLDivElement>(null)
  const selected = toDate(value)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const displayValue = selected
    ? selected.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : ''

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1949 }, (_, i) => currentYear - i)
  const MONTHS_VI = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
                     'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12']

  function handleMonthSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const m = new Date(month)
    m.setMonth(Number(e.target.value))
    setMonth(m)
  }

  function handleYearSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const m = new Date(month)
    m.setFullYear(Number(e.target.value))
    setMonth(m)
  }

  const selectClass =
    'bg-[#0d1117] border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer'

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={value} />

      {/* Trigger */}
      <button
        type="button"
        id={id}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm border bg-[#1f2844] border-white/10 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left"
      >
        <CalendarDays size={14} className="text-gray-500 shrink-0" />
        <span className={displayValue ? 'text-white' : 'text-gray-500'}>
          {displayValue || placeholder}
        </span>
      </button>

      {/* Popover */}
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-[#161c2d] border border-white/10 rounded-xl shadow-2xl p-4 min-w-[260px]">
          {/* Month / Year dropdowns */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <select
                value={month.getMonth()}
                onChange={handleMonthSelect}
                className={selectClass}
              >
                {MONTHS_VI.map((label, i) => (
                  <option key={i} value={i}>{label}</option>
                ))}
              </select>
              <select
                value={month.getFullYear()}
                onChange={handleYearSelect}
                className={selectClass}
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <DayPicker
            mode="single"
            month={month}
            onMonthChange={setMonth}
            selected={selected}
            onSelect={(date) => {
              onChange(date ? toISO(date) : '')
              setOpen(false)
            }}
            disabled={{ after: new Date() }}
            classNames={{
              month:       'w-full',
              month_caption: 'hidden',
              nav:         'hidden',
              month_grid:  'w-full border-collapse',
              weekdays:    'flex',
              weekday:     'flex-1 text-center text-[11px] text-gray-500 font-medium pb-2',
              week:        'flex mt-1',
              day:         'flex-1 flex items-center justify-center p-0',
              day_button:  'w-8 h-8 rounded-lg text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center w-full',
              selected:    '[&>button]:!bg-blue-600 [&>button]:!text-white',
              today:       '[&>button]:text-blue-400 [&>button]:font-bold',
              outside:     '[&>button]:text-gray-600 [&>button]:hover:bg-transparent',
              disabled:    '[&>button]:opacity-25 [&>button]:cursor-not-allowed [&>button]:hover:bg-transparent',
            }}
          />
        </div>
      )}
    </div>
  )
}
