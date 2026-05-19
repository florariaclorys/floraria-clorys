const items = [
  { icon: '🌸', title: 'Livrare Rapidă', subtitle: '1–3 ore în Țara Oașului' },
  { icon: '🚗', title: 'Livrare Gratuită', subtitle: 'Negrești Oaș' },
  { icon: '🌺', title: 'Flori Proaspete', subtitle: 'Garantat de la producători' },
  { icon: '💌', title: 'Mesaj Personalizat', subtitle: 'Inclus gratuit la orice comandă' },
  { icon: '💵', title: 'Plată Ramburs', subtitle: 'Cash la livrare' },
]

const separator = <span className="mx-8 text-white/20 text-xs select-none">✦</span>

export default function FeaturesBar() {
  const doubled = [...items, ...items]

  return (
    <div className="bg-[#4a0f1e] border-b border-white/10 overflow-hidden py-2.5 z-40 sticky top-20">
      <div className="flex marquee-track w-max">
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-2.5 px-6 whitespace-nowrap">
            <span className="text-base leading-none">{item.icon}</span>
            <span className="font-cormorant text-sm font-semibold text-white tracking-wide">{item.title}</span>
            <span className="font-lato text-[11px] text-white/55">— {item.subtitle}</span>
            {separator}
          </div>
        ))}
      </div>
    </div>
  )
}
