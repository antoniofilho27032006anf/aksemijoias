import Link from 'next/link'

const NAV_LINKS = [
  { href: '/',         label: 'Início' },
  { href: '/contact',  label: 'Contato' },
  { href: '/about',    label: 'Quem somos' },
  { href: '/garantia', label: 'Garantia e Cuidados' },
  { href: '/duvidas',  label: 'Tire suas Dúvidas' },
]

export function Footer() {
  return (
    <>
      {/* ── Floating WhatsApp button ── */}
      <a
        href="https://wa.me/558399038929"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale conosco pelo WhatsApp"
        className="fixed bottom-5 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition hover:scale-110 active:scale-95"
        style={{ backgroundColor: '#25D366' }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* ── Footer ── */}
      <footer className="border-t" style={{ borderColor: '#e8d5f5', backgroundColor: '#faf5ff' }}>

        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">

          {/* Top accent line */}
          <div className="mb-6 h-0.5 w-full rounded-full" style={{ background: 'linear-gradient(to right, #7C3D8E, #C4509B, transparent)' }} />

          <div className="grid gap-8 sm:grid-cols-3">

            {/* ── Col 1: Logo + WhatsApp atendimento ── */}
            <div className="flex flex-col gap-4">
              <Link href="/">
                <img src="/logo.png" alt="AK Semijóias" className="h-10 w-auto object-contain" />
              </Link>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: '#7C3D8E' }}>
                  Atendimento Exclusivo
                </p>
                <p className="mt-2 text-xs leading-relaxed text-gray-500">
                  Entre em contato conosco clicando no ícone do WhatsApp que aparece no canto inferior direito de seu visor.
                </p>
                <a
                  href="https://wa.me/558399038929"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-white transition hover:opacity-90"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Falar no WhatsApp
                </a>
              </div>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/aksemijoias_e_tals/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 transition hover:text-[#C4509B]"
              >
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4.5"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none"/>
                  </svg>
                </span>
                @aksemijoias_e_tals
              </a>
            </div>

            {/* ── Col 2: Desconto ── */}
            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: '#7C3D8E' }}>
                Ofertas &amp; Pagamento
              </p>

              <div
                className="rounded-xl border p-4"
                style={{ borderColor: '#e8d5f5', backgroundColor: '#fff' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black" style={{ color: '#C4509B' }}>5%</span>
                  <div>
                    <p className="text-[11px] font-black uppercase leading-tight" style={{ color: '#7C3D8E' }}>
                      Desconto à vista
                    </p>
                    <p className="text-[10px] text-gray-400">no PIX</p>
                  </div>
                </div>
                <p className="mt-2.5 text-[11px] leading-relaxed text-gray-500">
                  Preço tabelado e, pagando no PIX, você ganha <strong style={{ color: '#C4509B' }}>5% de desconto</strong> na compra!
                </p>
              </div>

              <div
                className="flex items-center gap-2 rounded-xl border p-3"
                style={{ borderColor: '#e8d5f5', backgroundColor: '#fff' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3D8E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                <p className="text-[11px] text-gray-500">
                  Parcelamos em até <strong style={{ color: '#7C3D8E' }}>6x sem juros</strong>
                </p>
              </div>
            </div>

            {/* ── Col 3: Navegação ── */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: '#7C3D8E' }}>
                Navegação
              </p>
              <ul className="mt-4 space-y-2.5">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-sm text-gray-600 transition hover:text-[#7C3D8E]"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C4509B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-6 border-t pt-4" style={{ borderColor: '#e8d5f5' }}>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[11px] text-gray-400">
                © {new Date().getFullYear()} AK Semijóias &amp; Tals · Todos os direitos reservados.
              </p>
              <p className="text-[11px] text-gray-400">Feito para encantar ✨</p>
            </div>
          </div>
        </div>

      </footer>
    </>
  )
}
