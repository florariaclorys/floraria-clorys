import Link from 'next/link'

const categories = [
  {
    slug: 'buchete',
    label: 'Buchete',
    icon: '💐',
    description: 'Buchete proaspete pentru orice ocazie',
    gradient: 'from-rose-900 to-primary',
  },
  {
    slug: 'aranjamente',
    label: 'Aranjamente',
    icon: '🌿',
    description: 'Aranjamente florale elaborate',
    gradient: 'from-emerald-900 to-emerald-700',
  },
  {
    slug: 'cutii',
    label: 'Cutii cu Flori',
    icon: '🎁',
    description: 'Cutii elegante pentru cadouri memorabile',
    gradient: 'from-secondary to-accent',
  },
  {
    slug: 'plante',
    label: 'Plante',
    icon: '🌱',
    description: 'Plante decorative cu durată lungă',
    gradient: 'from-green-900 to-teal-700',
  },
  {
    slug: 'ocazii',
    label: 'Ocazii Speciale',
    icon: '✨',
    description: 'Cadouri florale pentru momente unice',
    gradient: 'from-purple-900 to-primary',
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.slug}
              href={`/catalog?category=${cat.slug}`}
              className="group relative overflow-hidden rounded-lg aspect-[3/4] flex flex-col justify-end card-hover cursor-pointer"
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} transition-transform duration-500 group-hover:scale-105`} />

              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />

              {/* Icon */}
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl filter drop-shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                {cat.icon}
              </div>

              {/* Text */}
              <div className="relative z-10 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <p className="font-cormorant text-xl font-semibold text-white leading-tight">{cat.label}</p>
                <p className="font-lato text-xs text-white/70 mt-1 leading-snug">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
