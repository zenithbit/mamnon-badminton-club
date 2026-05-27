import { Toaster } from 'sonner'
import Sidebar from '@/components/layout/sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full bg-[#0d1117]">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {children}
      </div>
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: { background: '#1f2844', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9' },
        }}
      />
    </div>
  )
}
