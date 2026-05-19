import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getDiscounts } from '@/lib/discounts'
import DiscountManager from '@/components/admin/DiscountManager'
import AdminShell from '@/components/admin/AdminShell'

function isAdminAuthenticated(): boolean {
  const cookieStore = cookies()
  return cookieStore.get('admin_session')?.value === 'authenticated'
}

export default async function AdminDiscountsPage() {
  if (!isAdminAuthenticated()) redirect('/admin')

  const discounts = await getDiscounts()

  return (
    <AdminShell>
      <div className="p-8">
        <div className="mb-8">
          <p className="font-lato text-xs tracking-widest uppercase text-accent mb-1">Admin / Discounturi</p>
          <h1 className="font-cormorant text-4xl text-textdark font-light">Coduri de Discount</h1>
        </div>
        <div className="bg-white border border-light rounded-lg p-8">
          <DiscountManager initialDiscounts={discounts} />
        </div>
      </div>
    </AdminShell>
  )
}
