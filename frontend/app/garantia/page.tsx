import Link from 'next/link'
import { Navbar } from '../../src/components/Navbar'
import { CartSidebar } from '../../src/components/CartSidebar'

const TOPICS = [
  {
    icon: '🛡️',
    title: 'Garantia das peças',
    text: 'Todas as nossas semijoias possuem garantia contra defeitos de fabricação. Em caso de problema, entre em contato conosco pelo WhatsApp e resolveremos rapidamente.',
  },
  {
    icon: '✨',
    title: 'Como conservar suas semijoias',
    text: 'Evite contato com água, perfume, cremes e suor excessivo. Guarde cada peça separadamente em embalagem macia para evitar arranhões.',
  },
  {
    icon: '🚿',
    title: 'Evite contato com líquidos',
    text: 'Retire sempre as semijoias antes de banhar, nadar ou praticar atividades físicas. A umidade acelera o desgaste do banho dourado ou prateado.',
  },
  {
    icon: '🧴',
    title: 'Produtos químicos',
    text: 'Produtos de limpeza, sabão e álcool em gel podem danificar o acabamento. Coloque as joias somente após aplicar perfume e cremes na pele.',
  },
  {
    icon: '📦',
    title: 'Armazenamento',
    text: 'Guarde em local seco, longe da luz solar direta. Use a embalagem original ou saquinhos de veludo para proteger do contato com o ar e da oxidação.',
  },
  {
    icon: '🔄',
    title: 'Trocas e devoluções',
    text: 'Aceitamos trocas em até 7 dias corridos após o recebimento, desde que a peça não tenha sido usada e esteja em perfeito estado com embalagem original.',
  },
]

export default function GarantiaPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-xl px-4 pb-20 pt-8 sm:px-6">

        <div className="mb-6 flex items-center gap-2">
          <div className="h-4 w-0.5 rounded-full" style={{ backgroundColor: '#7C3D8E' }} />
          <h1 className="text-base font-black uppercase tracking-[0.2em]" style={{ color: '#7C3D8E' }}>
            Garantia e Cuidados
          </h1>
        </div>

        <p className="mb-6 text-sm text-gray-500">
          Saiba como cuidar das suas semijoias para que durem muito mais e continuem sempre lindas.
        </p>

        <div className="flex flex-col gap-3">
          {TOPICS.map((topic) => (
            <div
              key={topic.title}
              className="flex gap-3 rounded-xl border p-4"
              style={{ borderColor: '#e8d5f5', backgroundColor: '#faf5ff' }}
            >
              <span className="flex-none text-2xl">{topic.icon}</span>
              <div>
                <p className="text-[13px] font-bold" style={{ color: '#7C3D8E' }}>{topic.title}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-gray-500">{topic.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-6 flex items-center gap-3 rounded-xl border p-4"
          style={{ borderColor: '#d1fae5', backgroundColor: '#f0fdf4' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#065f46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <div>
            <p className="text-[12px] font-bold text-green-800">Dúvidas? Fale conosco!</p>
            <a href="https://wa.me/558399038929" target="_blank" rel="noopener noreferrer" className="text-[11px] text-green-700 underline">
              (83) 9903-8929 via WhatsApp
            </a>
          </div>
        </div>

        <Link href="/" className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold transition hover:text-[#7C3D8E]" style={{ color: '#C4509B' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          Voltar à loja
        </Link>
      </main>

      <CartSidebar />
    </div>
  )
}
