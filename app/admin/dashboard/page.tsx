import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getOrders } from '@/lib/orders'
import { getProducts } from '@/lib/products'
import Link from 'next/link'
import { Order } from '@/types'
import AdminShell from '@/components/admin/AdminShell'

function isAdminAuthenticated(): boolean {
  const cookieStore = cookies()
  return cookieStore.get('admin_session')?.value === 'authenticated'
}

const STATUS_CONFIG: Record<Order['status'], { label: string; color: string }> = {
  pending: { label: 'În așteptare', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmată', color: 'bg-blue-100 text-blue-800' },
  in_progress: { label: 'În pregătire', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Livrată', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Anulată', color: 'bg-red-100 text-red-800' },
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' })

export default async function AdminDashboard() {
  if (!isAdminAuthenticated()) redirect('/admin')

  const orders = await getOrders()
  const products = await getProducts()

  const today = new Date().toISOString().split('T')[0]
  const todayOrders = orders.filter(o => o.createdAt?.startsWith(today))
  const pendingOrders = orders.filter(o => o.status === 'pending')
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)
  const todayRevenue = todayOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)
  const outOfStock = products.filter(p => !p.inStock)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8)

  return (
    <AdminShell pendingCount={pendingOrders.length}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <p className="font-lato text-xs tracking-widest uppercase text-accent mb-1">Panou Admin</p>
          <h1 className="font-cormorant text-4xl text-textdark font-light">Dashboard</h1>
        </div>

        {/* Alert comenzi în așteptare */}
        {pendingOrders.length > 0 && (
          <Link href="/admin/comenzi" className="block mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-5 py-4 flex items-center gap-4 hover:bg-yellow-100 transition-colors">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <p className="font-lato text-sm font-semibold text-yellow-800">
                  {pendingOrders.length} {pendingOrders.length === 1 ? 'comandă necesită' : 'comenzi necesită'} atenție
                </p>
                <p className="font-lato text-xs text-yellow-600 mt-0.5">Click pentru a gestiona comenzile în așteptare</p>
              </div>
              <span className="font-lato text-sm text-yellow-700 font-semibold">Vezi →</span>
            </div>
          </Link>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Comenzi azi', value: todayOrders.length, icon: '📅', sub: `${todayRevenue} RON azi`, color: 'border-blue-100 bg-blue-50' },
            { label: 'În așteptare', value: pendingOrders.length, icon: '⏳', sub: 'necesită confirmare', color: pendingOrders.length > 0 ? 'border-yellow-200 bg-yellow-50' : 'border-light bg-white' },
            { label: 'Venit total', value: `${totalRevenue.toFixed(0)} RON`, icon: '💰', sub: `din ${orders.filter(o => o.status !== 'cancelled').length} comenzi`, color: 'border-green-100 bg-green-50' },
            { label: 'Produse active', value: products.filter(p => p.inStock).length, icon: '🌸', sub: outOfStock.length > 0 ? `${outOfStock.length} fără stoc` : 'toate în stoc', color: outOfStock.length > 0 ? 'border-red-100 bg-red-50' : 'border-pink-100 bg-pink-50' },
          ].map(s => (
            <div key={s.label} className={`border rounded-xl p-5 ${s.color}`}>
              <span className="text-2xl">{s.icon}</span>
              <p className="font-cormorant text-3xl font-bold text-textdark mt-2">{s.value}</p>
              <p className="font-lato text-xs font-semibold text-textdark/70 mt-0.5">{s.label}</p>
              <p className="font-lato text-xs text-textdark/40 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent orders */}
          <div className="lg:col-span-2 bg-white border border-light rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-light flex items-center justify-between">
              <h2 className="font-cormorant text-xl text-textdark font-semibold">Comenzi Recente</h2>
              <Link href="/admin/comenzi" className="font-lato text-xs text-accent hover:text-primary transition-colors">
                Vezi toate →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-background border-b border-light">
                    <th className="px-4 py-3 text-left font-lato text-[10px] tracking-widest uppercase text-textdark/40">Client</th>
                    <th className="px-4 py-3 text-right font-lato text-[10px] tracking-widest uppercase text-textdark/40">Total</th>
                    <th className="px-4 py-3 text-left font-lato text-[10px] tracking-widest uppercase text-textdark/40">Livrare</th>
                    <th className="px-4 py-3 text-left font-lato text-[10px] tracking-widest uppercase text-textdark/40">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center font-lato text-sm text-textdark/30">
                        Nu există comenzi încă
                      </td>
                    </tr>
                  ) : recentOrders.map((order, i) => {
                    const sc = STATUS_CONFIG[order.status]
                    return (
                      <tr key={order.id} className={`border-b border-light/50 last:border-0 ${i % 2 === 0 ? '' : 'bg-background/50'}`}>
                        <td className="px-4 py-3">
                          <p className="font-lato text-sm text-textdark">{order.customer.name}</p>
                          <p className="font-lato text-xs text-textdark/40">{order.id}</p>
                        </td>
                        <td className="px-4 py-3 font-cormorant text-lg font-bold text-primary text-right">{order.total} RON</td>
                        <td className="px-4 py-3 font-lato text-xs text-textdark/60">{formatDate(order.deliveryDate)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full font-lato text-[10px] font-semibold ${sc.color}`}>
                            {sc.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Quick actions */}
            <div className="bg-white border border-light rounded-xl p-5">
              <h3 className="font-cormorant text-lg text-textdark font-semibold mb-4">Acțiuni Rapide</h3>
              <div className="space-y-2">
                <Link href="/admin/produse" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors group">
                  <span className="text-xl">➕</span>
                  <span className="font-lato text-sm text-textdark group-hover:text-primary transition-colors">Adaugă produs nou</span>
                </Link>
                <Link href="/admin/discounturi" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors group">
                  <span className="text-xl">🏷️</span>
                  <span className="font-lato text-sm text-textdark group-hover:text-primary transition-colors">Crează cod discount</span>
                </Link>
                <Link href="/admin/comenzi?filter=pending" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors group">
                  <span className="text-xl">✅</span>
                  <span className="font-lato text-sm text-textdark group-hover:text-primary transition-colors">Confirmă comenzi</span>
                </Link>
              </div>
            </div>

            {/* Out of stock */}
            {outOfStock.length > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-5">
                <h3 className="font-cormorant text-lg text-red-800 font-semibold mb-3">⚠️ Fără stoc</h3>
                <div className="space-y-2">
                  {outOfStock.slice(0, 5).map(p => (
                    <div key={p.id} className="flex items-center justify-between">
                      <p className="font-lato text-xs text-red-700 truncate flex-1">{p.name}</p>
                      <Link href="/admin/produse" className="font-lato text-[10px] text-red-500 hover:text-red-700 ml-2">edit</Link>
                    </div>
                  ))}
                  {outOfStock.length > 5 && (
                    <p className="font-lato text-xs text-red-400">+{outOfStock.length - 5} altele</p>
                  )}
                </div>
              </div>
            )}

            {/* Stats produse */}
            <div className="bg-white border border-light rounded-xl p-5">
              <h3 className="font-cormorant text-lg text-textdark font-semibold mb-3">Produse pe categorie</h3>
              <div className="space-y-2">
                {['buchete', 'aranjamente', 'cutii', 'plante', 'ocazii'].map(cat => {
                  const count = products.filter(p => p.category === cat).length
                  if (count === 0) return null
                  return (
                    <div key={cat} className="flex items-center justify-between">
                      <span className="font-lato text-xs text-textdark/60 capitalize">{cat}</span>
                      <span className="font-lato text-xs font-semibold text-textdark">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
