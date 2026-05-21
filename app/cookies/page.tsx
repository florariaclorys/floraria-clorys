import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politică Cookies | Floraria Clory\'s',
  description: 'Politica de utilizare a cookie-urilor pe site-ul Floraria Clory\'s.',
}

export default function CookiesPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="font-lato text-xs tracking-widest uppercase text-accent mb-2">Legal</p>
        <h1 className="font-cormorant text-4xl text-textdark font-light mb-10">Politică Cookies</h1>

        <div className="font-lato text-textdark/80 space-y-8">

          <section>
            <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-3">Ce sunt cookie-urile?</h2>
            <p className="text-sm leading-relaxed">
              Cookie-urile sunt fișiere text de mici dimensiuni stocate pe dispozitivul dumneavoastră atunci când
              vizitați un site web. Ele permit site-ului să rețină preferințele și informațiile de sesiune.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-3">Ce cookie-uri folosim</h2>
            <div className="space-y-4">
              <div className="bg-light/50 rounded-lg p-4">
                <p className="text-sm font-bold text-textdark mb-1">🔒 Cookie-uri strict necesare</p>
                <p className="text-sm leading-relaxed text-textdark/70">
                  Esențiale pentru funcționarea site-ului (sesiune admin, coș de cumpărături). Nu pot fi dezactivate.
                </p>
              </div>
              <div className="bg-light/50 rounded-lg p-4">
                <p className="text-sm font-bold text-textdark mb-1">📊 Cookie-uri de performanță</p>
                <p className="text-sm leading-relaxed text-textdark/70">
                  Ne ajută să înțelegem cum interacționați cu site-ul (pagini vizitate, timp petrecut).
                  Datele sunt anonime și agregate.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-3">Cum controlați cookie-urile</h2>
            <p className="text-sm leading-relaxed">
              Puteți controla și/sau șterge cookie-urile prin setările browserului dumneavoastră. Dezactivarea
              cookie-urilor strict necesare poate afecta funcționalitatea site-ului (ex: coșul de cumpărături).
            </p>
            <p className="text-sm leading-relaxed mt-2">
              Mai multe informații la:{' '}
              <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                aboutcookies.org
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-3">Contact</h2>
            <p className="text-sm leading-relaxed">
              Întrebări privind utilizarea cookie-urilor: <strong>florariaclorys@gmail.com</strong>
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
