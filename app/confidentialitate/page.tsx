import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politică de Confidențialitate | Floraria Clory\'s',
  description: 'Politica de confidențialitate și protecția datelor cu caracter personal — Floraria Clory\'s.',
}

export default function ConfidentialitatePage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="font-lato text-xs tracking-widest uppercase text-accent mb-2">Legal</p>
        <h1 className="font-cormorant text-4xl text-textdark font-light mb-10">Politică de Confidențialitate</h1>

        <div className="font-lato text-textdark/80 space-y-8">

          <section>
            <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-3">1. Operatorul de date</h2>
            <p className="text-sm leading-relaxed">
              <strong>Floraria Clory&apos;s</strong>, Strada Victoriei 28, Negrești-Oaș, județul Satu Mare,
              email: florariaclorys@gmail.com, telefon: 0770 930 786.
            </p>
            <p className="text-sm leading-relaxed mt-2">
              Prelucrăm datele cu caracter personal în conformitate cu Regulamentul (UE) 2016/679 (GDPR)
              și legislația națională în vigoare.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-3">2. Ce date colectăm</h2>
            <ul className="text-sm leading-relaxed list-disc pl-5 space-y-1">
              <li>Nume și prenume</li>
              <li>Adresă de email</li>
              <li>Număr de telefon</li>
              <li>Adresă de livrare (stradă, oraș, județ)</li>
              <li>Istoricul comenzilor</li>
            </ul>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-3">3. Scopul prelucrării</h2>
            <ul className="text-sm leading-relaxed list-disc pl-5 space-y-1">
              <li>Procesarea și livrarea comenzilor</li>
              <li>Comunicare privind statusul comenzilor</li>
              <li>Respectarea obligațiilor legale (facturare, contabilitate)</li>
              <li>Soluționarea reclamațiilor</li>
            </ul>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-3">4. Temeiul legal</h2>
            <p className="text-sm leading-relaxed">
              Prelucrarea datelor se realizează în baza art. 6 alin. (1) lit. b) din GDPR (executarea unui contract),
              art. 6 alin. (1) lit. c) (obligație legală) și, unde este cazul, consimțământul dumneavoastră explicit.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-3">5. Durata stocării</h2>
            <p className="text-sm leading-relaxed">
              Datele aferente comenzilor se păstrează 5 ani conform legislației fiscale. Datele de contact se păstrează
              până la retragerea consimțământului sau la cererea de ștergere a utilizatorului.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-3">6. Drepturile dumneavoastră</h2>
            <p className="text-sm leading-relaxed mb-2">Conform GDPR, aveți dreptul la:</p>
            <ul className="text-sm leading-relaxed list-disc pl-5 space-y-1">
              <li><strong>Acces</strong> — să solicitați o copie a datelor personale deținute</li>
              <li><strong>Rectificare</strong> — corectarea datelor inexacte</li>
              <li><strong>Ștergere</strong> — &quot;dreptul de a fi uitat&quot;</li>
              <li><strong>Restricționare</strong> — limitarea prelucrării</li>
              <li><strong>Portabilitate</strong> — primirea datelor în format structurat</li>
              <li><strong>Opoziție</strong> — opunerea prelucrării în scop de marketing</li>
            </ul>
            <p className="text-sm leading-relaxed mt-3">
              Cererile se transmit la: <strong>florariaclorys@gmail.com</strong>. Răspundem în maximum 30 de zile.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-3">7. Securitatea datelor</h2>
            <p className="text-sm leading-relaxed">
              Utilizăm măsuri tehnice și organizatorice adecvate pentru protejarea datelor (conexiune HTTPS, stocare
              securizată prin Supabase cu criptare în repaus). Nu vindem și nu transmitem datele dumneavoastră terților,
              cu excepția partenerilor de livrare sau a obligațiilor legale.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-3">8. Reclamații</h2>
            <p className="text-sm leading-relaxed">
              Aveți dreptul de a depune plângere la <strong>Autoritatea Națională de Supraveghere a Prelucrării Datelor
              cu Caracter Personal (ANSPDCP)</strong>:{' '}
              <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                www.dataprotection.ro
              </a>
            </p>
          </section>

          <p className="text-xs text-textdark/40 border-t border-light pt-4 mt-8">
            Ultima actualizare: mai 2026
          </p>
        </div>
      </div>
    </div>
  )
}
