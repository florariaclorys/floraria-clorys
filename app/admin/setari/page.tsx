import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getBusinessHours } from '@/lib/settings'
import AdminShell from '@/components/admin/AdminShell'
import HoursForm from '@/components/admin/HoursForm'
import PasswordForm from '@/components/admin/PasswordForm'

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
          <h1 className="font-cormorant text-4xl text-textdark font-light">Setări</h1>
        </div>

        {/* Program de lucru */}
        <div className="bg-white border border-light rounded-xl p-6 mb-6">
          <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-1">Program de lucru</h2>
          <p className="font-lato text-sm text-textdark/50 mb-6">
            Modificările se aplică imediat pe site în header și în footer.
          </p>
          <HoursForm initialHours={hours} />
        </div>

        {/* Schimbare parolă */}
        <div className="bg-white border border-light rounded-xl p-6">
          <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-1">Schimbă parola</h2>
          <p className="font-lato text-sm text-textdark/50 mb-6">
            Parola este folosită pentru accesul în panoul de administrare.
          </p>
          <PasswordForm />
        </div>
      </div>
    </AdminShell>
  )
}
