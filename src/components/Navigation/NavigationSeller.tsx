import Link from 'next/link'

export default function NavigationSeller() {
  return (
    <nav className="flex gap-4">
      <Link href="/seller/dashboard">Seller Dashboard</Link>
      <Link href="/seller/products">Products</Link>
      <Link href="/seller/orders">Orders</Link>
      <Link href="/seller/messages">Messages</Link>
    </nav>
  )
}
