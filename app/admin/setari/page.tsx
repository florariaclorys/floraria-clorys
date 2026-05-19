import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getBusinessHours } from '@/lib/settings'
import AdminShell from '@/components/admin/AdminShell'
import HoursForm from '@/components/admin/HoursForm'

function isAdminAuthenticated(): boolean {
  const cookieStore = cookies()
  return cookieStore.get('admin_session')?.value === 'authenticated'
}

export default async function SetariPage() {
  if (!isAdminAuthenticated()) redirect('/admin')

  const hours = await getBusinessHours()

  return (
    <AdminShell>
      <div className="p-8 max-w-2xl">
        <div className="mb-8">
          <p className="font-lato text-xs tracking-widest uppercase text-accent mb-1">Panou Admin</p>
          <h1 className="font-cormorant text-4xl text-textdark font-light">Setari</h1>
        </div>

        <div className="bg-white border border-light rounded-xl p-6">
          <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-1">Program de lucru</h2>
          <p className="font-lato text-sm text-textdark/50 mb-6">
            Modificarile se aplica imediat pe site in header si in footer.
          </p>
          <HoursForm initialHours={hours} />
        </div>
      </div>
    </AdminShell>
  )
}
