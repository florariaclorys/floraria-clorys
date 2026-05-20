import Link from 'next/link'

const categories = [
  {
    slug: 'buchete',
    label: 'Buchete',
    description: 'Buchete proaspete pentru orice ocazie',
    bg: '#6B1A2E',
    text: '#C9A96E',
    shadowColor: '#2A0A12',
  },
  {
    slug: 'aranjamente',
    label: 'Aranjamente',
    description: 'Compoziții florale elaborate',
    bg: '#C9A96E',
    text: '#2A0A12',
    shadowColor: '#6B1A2E',
  },
  {
    slug: 'cutii',
    label: 'Cutii cu Flori',
    description: 'Cadouri elegante și memorabile',
    bg: '#8B2340',
    text: '#F5E6EA',
    shadowColor: '#2A0A12',
  },
  {
    slug: 'plante',
    label: 'Plante',
    description: 'Decorațiuni verzi cu durată lungă',
    bg: '#1B3A2F',
    text: '#C9A96E',
    shadowColor: '#0D1F19',
  },
  {
    slug: 'ocazii',
    label: 'Ocazii Speciale',
    description: 'Cadouri pentru momente unice',
    bg: '#F5E6EA',
    text: '#6B1A2E',
    shadowColor: '#C4708A',
  },
]

export default function CategoryGrid() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="section-subheading">Explorează</p>
        <h2 className="section-heading">Categorii de Flori</h2>
        <div className="section-divider">
          <div className="w-16 h-px bg-accent" />
          <span className="text-accent text-lg">✿</span>
          <div className="w-16 h-px bg-accent" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map(cat => (
            <Link
              key={cat.slug}
              href={`/catalog?category=${cat.slug}`}
              className="block category-btn-link"
            >
              <div
                className="category-btn flex flex-col justify-center items-center py-10 px-6 text-center"
                style={{
                  background: cat.bg,
                  '--cat-shadow': `6px 6px 0px ${cat.shadowColor}`,
                  '--cat-shadow-hover': `2px 2px 0px ${cat.shadowColor}`,
                } as React.CSSProperties}
              >
                <p
                  className="font-cormorant text-2xl font-semibold mb-2 leading-tight"
                  style={{ color: cat.text }}
                >
                  {cat.label}
                </p>
                <p
                  className="font-lato text-xs tracking-wide leading-snug"
                  style={{ color: cat.text, opacity: 0.75 }}
                >
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
