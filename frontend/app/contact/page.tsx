import Link from 'next/link'
import { Navbar } from '../../src/components/Navbar'
import { CartSidebar } from '../../src/components/CartSidebar'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-xl px-4 pb-20 pt-8 sm:px-6">

        <div className="mb-6 flex items-center gap-2">
          <div className="h-4 w-0.5 rounded-full" style={{ backgroundColor: '#7C3D8E' }} />
          <h1 className="text-base font-black uppercase tracking-[0.2em]" style={{ color: '#7C3D8E' }}>
            Contato
          </h1>
        </div>

        <p className="mb-6 text-sm text-gray-500">
          Estamos aqui para te ajudar! Fale com a gente pelas redes sociais ou pelo WhatsApp.
        </p>

        {/* WhatsApp */}
        <a
          href="https://wa.me/558399038929"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-xl border p-4 transition hover:border-[#25D366] hover:shadow-sm mb-3"
          style={{ borderColor: '#e8d5f5' }}
        >
          <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl" style={{ backgroundColor: '#25D366' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">WhatsApp</p>
            <p className="text-xs text-gray-400">(83) 9903-8929 · Clique para conversar</p>
          </div>
          <svg className="ml-auto text-gray-300" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </a>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/aksemijoias_e_tals/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-xl border p-4 transition hover:shadow-sm"
          style={{ borderColor: '#e8d5f5' }}
        >
          <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4.5"/>
              <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">Instagram</p>
            <p className="text-xs text-gray-400">@aksemijoias_e_tals · Clique para seguir</p>
          </div>
          <svg className="ml-auto text-gray-300" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </a>

        <div className="mt-8 rounded-xl border p-4 text-sm text-gray-500" style={{ borderColor: '#e8d5f5', backgroundColor: '#faf5ff' }}>
          <p className="font-semibold text-gray-700">Horário de atendimento</p>
          <p className="mt-1">Segunda a Sexta: 8h às 18h</p>
          <p>Sábado: 8h às 13h</p>
        </div>

        <Link href="/" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition hover:text-[#7C3D8E]" style={{ color: '#C4509B' }}>
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
