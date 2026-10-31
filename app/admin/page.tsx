import type { Metadata } from 'next'

import { AdminDashboard } from '@/components/admin/admin-dashboard'

export const metadata: Metadata = {
  title: '声音图谱管理 | Bird Symphony Admin',
  robots: { index: false, follow: false },
}

export default function AdminPage() {
  return <AdminDashboard />
}
