const testimonials = [
  {
    name: 'Ioan Bumb',
    location: 'Țara Oașului',
    rating: 5,
    text: 'Am comandat un buchet de trandafiri pentru aniversarea noastră și a fost absolut superb! Florile erau proaspete, ambalajul elegant și livrarea promptă. Soțul meu a fost încântat. Cu siguranță voi comanda din nou!',
    date: 'Februarie 2025',
  },
  {
    name: 'Andrei Finta',
    location: 'Țara Oașului',
    rating: 5,
    text: 'Serviciu impecabil! Am comandat o cutie cu trandafiri pentru Valentine\'s Day și a arătat exact ca în poze, ba chiar mai frumoasă. Livrarea a fost în intervalul promis. Recomand cu căldură tuturor!',
    date: 'Februarie 2025',
  },
  {
    name: 'Carina Bura',
    location: 'Ilfov',
    rating: 5,
    text: 'Am folosit Floraria Clory\'s pentru decorațiunile nunții noastre și a fost cea mai bună decizie. Aranjamentele au fost spectaculoase, exact cum le-am visat. Prețuri corecte și personal foarte amabil.',
    date: 'Septembrie 2024',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="section-subheading">Recenzii</p>
        <h2 className="section-heading">Ce Spun Clienții Noștri</h2>
        <div className="section-divider">
          <div className="w-16 h-px bg-accent" />
          <span className="text-accent text-lg">✿</span>
          <div className="w-16 h-px bg-accent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white border border-light rounded-lg p-8 relative card-hover"
            >
              {/* Quote mark */}
              <div
                className="absolute -top-4 left-8 w-8 h-8 bg-primary rounded-full flex items-center justify-center"
              >
                <span className="text-white text-lg leading-none font-serif">&ldquo;</span>
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4 mt-2">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} className="text-gold text-lg">★</span>
                ))}
              </div>

              <p className="font-lato text-sm text-textdark/70 leading-relaxed mb-6 italic">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3 border-t border-light pt-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                  <span className="font-cormorant text-white text-lg font-bold">
                    {t.name[0]}
                  </span>
                </div>
                <div>
                  <p className="font-cormorant text-base font-semibold text-textdark">{t.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16 p-8 bg-light rounded-lg">
          <p className="font-cormorant text-3xl text-primary mb-2">Satisfacția ta este prioritatea noastră</p>
          <p className="font-lato text-sm text-textdark/60 mb-6">
            Peste 500 de clienți fericiți în ultimul an. Alătură-te comunității Clory&apos;s!
          </p>
          <div className="flex items-center justify-center gap-1">
            {[1,2,3,4,5].map(s => (
              <span key={s} className="text-gold text-2xl">★</span>
            ))}
            <span className="font-lato text-sm text-textdark/60 ml-2">5.0 / 5.0</span>
          </div>
        </div>
      </div>
    </section>
  )
}
