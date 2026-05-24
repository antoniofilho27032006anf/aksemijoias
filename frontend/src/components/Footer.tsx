import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-[#1a0a3c]/30 bg-[#09040f]">
      <div className="h-px bg-gradient-to-r from-transparent via-[#7c3aed] to-transparent opacity-50" />

      <div className="mx-auto flex max-w-[1320px] flex-col gap-12 px-4 py-14 sm:px-8 lg:flex-row lg:items-start lg:justify-between">

        {/* Brand */}
        <div className="max-w-xs space-y-4">
          <span
            className="text-2xl font-black tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 50%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            AK Semij&oacute;ias &amp; Tals
          </span>
          <p className="text-sm leading-relaxed text-[#9080c8]">
            Coleções selecionadas com acabamento delicado, para quem busca elegância e conforto em cada detalhe.
          </p>
          <div className="flex gap-3">
            {['Instagram', 'WhatsApp'].map((social) => (
              <a
                key={social}
                href="#"
                className="rounded-xl border border-[#7c3aed]/30 bg-[#1a0a3c]/40 px-3 py-2 text-xs font-medium text-[#c0b0e0] transition hover:border-[#a78bfa]/60 hover:text-[#c4b5fd]"
              >
                {social}
              </a>
            ))}
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a78bfa]">Loja</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                { href: '/', label: 'Coleções' },
                { href: '/favorites', label: 'Favoritos' },
                { href: '/orders', label: 'Meus pedidos' },
                { href: '/search', label: 'Buscar' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#9080c8] transition hover:text-[#c4b5fd]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a78bfa]">Ajuda</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {['Atendimento', 'Trocas e devoluções', 'Segurança'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[#9080c8] transition hover:text-[#c4b5fd]">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a78bfa]">Novidades</h3>
            <p className="mt-4 text-sm leading-relaxed text-[#7060a8]">
              Receba lançamentos e ofertas exclusivas.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="rounded-xl border border-[#7c3aed]/30 bg-[#1a0a3c]/40 px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#a78bfa]/60 placeholder:text-[#5040a0]"
              />
              <button
                className="rounded-xl py-2.5 text-sm font-bold text-white transition hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 50%, #6d28d9 100%)' }}
              >
                Assinar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#7c3aed]/15 bg-[#060210] py-5">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-2 px-4 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8 text-[#5040a0]">
          <p>© {new Date().getFullYear()} AKsemijoias. Todos os direitos reservados.</p>
          <p>Feito para encantar.</p>
        </div>
      </div>
    </footer>
  )
}
