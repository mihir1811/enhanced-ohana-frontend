'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingCart, DollarSign } from 'lucide-react'

export default function SellerDashboardPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <DashboardCard
        title="Total Products"
        icon={<Package className="w-6 h-6 text-primary" />}
        value="128"
      />
      <DashboardCard
        title="Total Orders"
        icon={<ShoppingCart className="w-6 h-6 text-primary" />}
        value="312"
      />
      <DashboardCard
        title="Revenue"
        icon={<DollarSign className="w-6 h-6 text-primary" />}
        value="$12,480"
      />
    </div>
  )
}

function DashboardCard({
  title,
  icon,
  value,
}: {
  title: string
  icon: React.ReactNode
  value: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
