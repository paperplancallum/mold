import { redirect } from 'next/navigation'
import { checkAdminAccess } from '@/lib/admin'
import Link from 'next/link'
import AdminDashboardClient from './AdminDashboardClient'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const { isAdmin, error } = await checkAdminAccess()

  if (!isAdmin) {
    redirect(`/dashboard?error=${encodeURIComponent(error || 'unauthorized')}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/dashboard" className="text-xl font-bold text-gray-900">
              MoldScope Admin
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                User Dashboard
              </Link>
              <Link
                href="/account"
                className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Account
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl py-12 px-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
          Admin Dashboard
        </h1>

        <AdminDashboardClient />
      </div>
    </div>
  )
}