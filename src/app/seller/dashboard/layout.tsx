export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto">
      {/* <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Seller Dashboard</h1>
        <p className="text-muted-foreground">Manage your jewelry business</p>
      </div> */}
      {children}
    </div>
  )
}
