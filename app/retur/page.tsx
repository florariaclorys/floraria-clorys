import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politică de Retur | Floraria Clory\'s',
  description: 'Politica de retur și înlocuire produse — Floraria Clory\'s.',
}

export default function ReturPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="font-lato text-xs tracking-widest uppercase text-accent mb-2">Legal</p>
        <h1 className="font-cormorant text-4xl text-textdark font-light mb-10">Politică de Retur</h1>

        <div className="font-lato text-textdark/80 space-y-8">

          <div className="bg-accent/10 border border-accent/30 rounded-xl p-5">
            <p className="text-sm leading-relaxed text-textdark/80">
              <strong>Important:</strong> Produsele florale sunt bunuri perisabile și, prin natura lor, nu pot fi
              returnate conform art. 16 lit. d) din OUG 34/2014 (care implementează Directiva UE 2011/83/UE).
              Cu toate acestea, ne angajăm să rezolvăm orice problemă legată de calitatea produselor livrate.
            </p>
          </div>

          <section>
            <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-3">Când ai dreptul la înlocuire sau rambursare</h2>
            <ul className="text-sm leading-relaxed list-disc pl-5 space-y-2">
              <li>Produsele livrate nu corespund cu comanda plasată (alt aranjament, alte flori)</li>
              <li>Produsele prezintă defecte de calitate evidente la momentul livrării (flori ofilite, deteriorate)</li>
              <li>Comanda nu a fost livrată în intervalul orar ales</li>
            </ul>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-3">Cum procedezi</h2>
            <ol className="text-sm leading-relaxed list-decimal pl-5 space-y-2">
              <li>Contactează-ne în <strong>maxim 24 de ore</strong> de la primirea comenzii</li>
              <li>Trimite o fotografie cu produsul la <strong>florariaclorys@gmail.com</strong> sau pe WhatsApp la <strong>0770 930 786</strong></li>
              <li>Îți confirmăm soluția în maxim 24 de ore (înlocuire sau rambursare)</li>
            </ol>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-3">Soluții disponibile</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-light/60 rounded-lg p-4">
                <p className="text-sm font-bold text-textdark mb-1">🌸 Înlocuire produs</p>
                <p className="text-sm text-textdark/70 leading-relaxed">
                  Livrăm un produs nou, de calitate corespunzătoare, fără costuri suplimentare.
                </p>
              </div>
              <div className="bg-light/60 rounded-lg p-4">
                <p className="text-sm font-bold text-textdark mb-1">💰 Rambursare</p>
                <p className="text-sm text-textdark/70 leading-relaxed">
                  Restituim suma plătită integral, în cazul în care înlocuirea nu este posibilă.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-3">Contact reclamații</h2>
            <div className="space-y-2">
              <p className="text-sm">📧 <strong>florariaclorys@gmail.com</strong></p>
              <p className="text-sm">📞 <strong>0770 930 786</strong></p>
              <p className="text-sm">💬 WhatsApp disponibil L–V 09:00–19:00, S 10:00–17:00</p>
            </div>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-3">Legislație aplicabilă</h2>
            <p className="text-sm leading-relaxed">
              OUG 34/2014 privind drepturile consumatorilor · OG 21/1992 privind protecția consumatorilor ·
              Legea 449/2003 privind vânzarea produselor și garanțiile asociate.
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
