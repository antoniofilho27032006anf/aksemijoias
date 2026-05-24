import Link from 'next/link'
import { Navbar } from '../../src/components/Navbar'
import { CartSidebar } from '../../src/components/CartSidebar'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-xl px-4 pb-20 pt-8 sm:px-6">

        <div className="mb-6 flex items-center gap-2">
          <div className="h-4 w-0.5 rounded-full" style={{ backgroundColor: '#7C3D8E' }} />
          <h1 className="text-base font-black uppercase tracking-[0.2em]" style={{ color: '#7C3D8E' }}>
            Quem Somos
          </h1>
        </div>

        <div className="mb-5 flex justify-center">
          <img src="/logo.png" alt="AK Semijóias" className="h-24 w-auto object-contain" />
        </div>

        <div className="space-y-4 text-sm leading-relaxed text-gray-600">
          <p>
            A <strong style={{ color: '#7C3D8E' }}>AK Semijóias &amp; Tals</strong> nasceu da paixão por acessórios que combinam elegância, qualidade e bom preço. Acreditamos que toda mulher merece se sentir especial a cada detalhe.
          </p>
          <p>
            Trabalhamos com semijoias cuidadosamente selecionadas — brincos, anéis, colares, pulseiras e muito mais — com acabamento delicado e materiais de qualidade que duram muito mais.
          </p>
          <p>
            Nossa missão é levar beleza e confiança para o dia a dia de cada cliente, com atendimento próximo, preços acessíveis e produtos que realmente encantam.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {[
            { icon: '💍', title: 'Qualidade', desc: 'Peças selecionadas com cuidado e atenção ao acabamento.' },
            { icon: '💜', title: 'Exclusividade', desc: 'Coleções únicas e modelos que você não encontra em todo lugar.' },
            { icon: '🚚', title: 'Entrega', desc: 'Enviamos para todo o Brasil com segurança e agilidade.' },
            { icon: '⭐', title: 'Satisfação', desc: 'Clientes satisfeitas são nossa maior conquista.' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border p-3.5" style={{ borderColor: '#e8d5f5', backgroundColor: '#faf5ff' }}>
              <span className="text-xl">{item.icon}</span>
              <p className="mt-1.5 text-[12px] font-bold" style={{ color: '#7C3D8E' }}>{item.title}</p>
              <p className="mt-1 text-[11px] text-gray-400">{item.desc}</p>
            </div>
          ))}
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
