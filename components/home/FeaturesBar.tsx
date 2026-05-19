const features = [
  {
    icon: '🌸',
    title: 'Livrare Rapidă',
    subtitle: '1-3 ore în Țara Oașului',
  },
  {
    icon: '🌺',
    title: 'Flori Proaspete',
    subtitle: 'Garantat de la producători',
  },
  {
    icon: '💌',
    title: 'Mesaj Personalizat',
    subtitle: 'Inclus gratuit la orice comandă',
  },
  {
    icon: '🔒',
    title: 'Plată Securizată',
    subtitle: 'Ramburs sau transfer bancar',
  },
]

export default function FeaturesBar() {
  return (
    <section className="bg-primary py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-white/10">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center px-4 py-2">
              <span className="text-3xl mb-2">{f.icon}</span>
              <p className="font-cormorant text-lg font-semibold text-white leading-tight">{f.title}</p>
              <p className="font-lato text-xs text-white/60 mt-1">{f.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
