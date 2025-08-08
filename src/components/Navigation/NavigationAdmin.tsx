export default function NavigationAdmin() {
  return (
    <nav className="flex gap-4">
      <a href="/admin/dashboard">Admin Dashboard</a>
      <a href="/admin/users">Manage Users</a>
      <a href="/admin/settings">Settings</a>
    </nav>
  )
}