import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termeni și Condiții | Floraria Clory\'s',
  description: 'Termenii și condițiile de utilizare ale site-ului Floraria Clory\'s.',
}

export default function TermeniPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="font-lato text-xs tracking-widest uppercase text-accent mb-2">Legal</p>
        <h1 className="font-cormorant text-4xl text-textdark font-light mb-10">Termeni și Condiții</h1>

        <div className="prose prose-sm max-w-none font-lato text-textdark/80 space-y-8">

          <section>
            <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-3">1. Informații despre comerciant</h2>
            <p>
              <strong>Floraria Clory&apos;s</strong>, cu sediul în Strada Victoriei 28, Negrești-Oaș, județul Satu Mare,
              email: florariaclorys@gmail.com, telefon: 0770 930 786.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-3">2. Obiectul contractului</h2>
            <p>
              Prin plasarea unei comenzi pe site-ul <strong>myclorys.com</strong>, clientul acceptă prezentele termeni și condiții.
              Floraria Clory&apos;s se obligă să livreze produsele florale comandate în condițiile specificate la plasarea comenzii.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-3">3. Produse și prețuri</h2>
            <p>
              Toate prețurile afișate pe site sunt exprimate în RON și includ TVA. Floraria Clory&apos;s își rezervă dreptul de a modifica
              prețurile fără notificare prealabilă, modificările neafectând comenzile deja plasate și confirmate.
            </p>
            <p className="mt-2">
              Produsele florale pot prezenta variații de nuanță față de imaginile de pe site datorită naturii perisabile și
              disponibilității sezoniere a florilor. Ne rezervăm dreptul de a substitui flori cu altele de valoare egală sau
              superioară în cazul indisponibilității.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-3">4. Plasarea comenzilor</h2>
            <p>
              Comenzile se pot plasa online pe myclorys.com sau telefonic la 0770 930 786. O comandă este considerată confirmată
              după ce clientul primește o confirmare prin email. Floraria Clory&apos;s poate refuza o comandă în cazul imposibilității
              de onorare, cu notificarea clientului.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-3">5. Livrare</h2>
            <p>
              Livrăm în Negrești-Oaș și localitățile din Țara Oașului. Livrarea este gratuită pentru comenzile de minimum 250 RON.
              Intervalul de livrare este ales de client la plasarea comenzii. Comenzile plasate înainte de ora 14:00 pot fi livrate
              în aceeași zi (cu supliment de 30 RON). Livrarea standard se efectuează în ziua lucrătoare următoare.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-3">6. Plata</h2>
            <p>
              Plata se efectuează ramburs, la livrare sau la ridicarea comenzii din magazin. Nu stocăm date de card.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-3">7. Dreptul de retragere (retur)</h2>
            <p>
              Conform OUG 34/2014, clientul are dreptul de a se retrage din contract în termen de 14 zile de la primirea produselor,
              cu excepția bunurilor perisabile (flori proaspete), care nu pot fi returnate conform art. 16 lit. d) din OUG 34/2014.
            </p>
            <p className="mt-2">
              În cazul în care produsele livrate nu corespund comenzii (greșeli din vina noastră), clientul are dreptul la
              înlocuire sau rambursare integrală. Reclamațiile se pot depune în maxim 24 de ore de la livrare, la
              florariaclorys@gmail.com sau 0770 930 786.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-3">8. Soluționarea litigiilor</h2>
            <p>
              În cazul unui litigiu, clientul poate contacta Autoritatea Națională pentru Protecția Consumatorilor (ANPC):
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>SAL</strong> (Soluționarea Alternativă a Litigiilor):{' '}
                <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  anpc.ro/ce-este-sal
                </a>
              </li>
              <li>
                <strong>SOL</strong> (Platforma Online UE):{' '}
                <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  ec.europa.eu/consumers/odr
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-3">9. Legea aplicabilă</h2>
            <p>
              Prezentele termeni și condiții sunt guvernate de legislația română în vigoare. Eventualele litigii se vor soluționa
              pe cale amiabilă sau, în caz de eșec, de instanțele judecătorești competente din România.
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
