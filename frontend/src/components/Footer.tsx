import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

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
      {/* Floating WhatsApp */}
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

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-bg-soft)' }}>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">

          {/* Accent line */}
          <div className="mb-6 h-px w-full" style={{ background: 'linear-gradient(to right, var(--color-brand), var(--gold), transparent)' }} />

          <div className="grid gap-8 sm:grid-cols-2">

            {/* Col 1 — Brand + social */}
            <div className="flex flex-col gap-3">
              <Link href="/">
                <span className="font-heading text-2xl font-semibold tracking-tight" style={{ color: 'var(--color-brand)' }}>
                  AK Semij&oacute;ias &amp; Tals
                </span>
              </Link>

              <p className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: 'var(--color-brand)' }}>
                Atendimento Exclusivo
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--c-dim)' }}>
                Entre em contato clicando no ícone do WhatsApp no canto inferior direito.
              </p>

              <div className="flex items-center gap-2">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/558399038929"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:scale-110"
                  style={{ backgroundColor: '#25D366' }}
                  aria-label="WhatsApp"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/aksemijoias_e_tals/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)' }}
                  aria-label="Instagram"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4.5"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Col 2 — Navigation */}
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--color-brand)' }}>
                Navegação
              </p>
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-1.5 text-sm transition hover:text-[var(--color-brand)]"
                      style={{ color: 'var(--c-muted)' }}
                    >
                      <ChevronRight size={12} strokeWidth={2.5} style={{ color: 'var(--color-brand-pink)' }} />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-6 border-t pt-4" style={{ borderColor: 'var(--c-border)' }}>
            <p className="text-[11px]" style={{ color: 'var(--c-vdim)' }}>
              © {new Date().getFullYear()} AK Semijóias &amp; Tals · Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
