import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-[rgba(120,60,220,0.15)] bg-[#040210]">
      {/* Top gold line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#c9a227] to-transparent opacity-40" />

      <div className="mx-auto flex max-w-[1320px] flex-col gap-12 px-4 py-14 sm:px-8 lg:flex-row lg:items-start lg:justify-between">

        {/* Brand */}
        <div className="max-w-xs space-y-4">
          <span
            className="text-2xl font-black tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #a78bfa 0%, #c9a227 60%, #f0c040 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            AKsemijoias
          </span>
          <p className="text-sm leading-relaxed text-[#5a4f7a]">
            Coleções selecionadas com acabamento delicado, para quem busca elegância e conforto em cada detalhe.
          </p>
          <div className="flex gap-3">
            {['Instagram', 'WhatsApp'].map((social) => (
              <a
                key={social}
                href="#"
                className="rounded-xl border border-[rgba(120,60,220,0.2)] bg-[rgba(12,8,28,0.8)] px-3 py-2 text-xs font-medium text-[#7c6fa0] transition hover:border-[rgba(201,162,39,0.35)] hover:text-[#e8c94a]"
              >
                {social}
              </a>
            ))}
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c9a227]">Loja</h3>
            <ul className="mt-4 space-y-3 text-sm text-[#7c6fa0]">
              {[
                { href: '/', label: 'Coleções' },
                { href: '/favorites', label: 'Favoritos' },
                { href: '/orders', label: 'Meus pedidos' },
                { href: '/search', label: 'Buscar' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-[#e8c94a]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c9a227]">Ajuda</h3>
            <ul className="mt-4 space-y-3 text-sm text-[#7c6fa0]">
              {['Atendimento', 'Trocas e devoluções', 'Segurança'].map((item) => (
                <li key={item}>
                  <a href="#" className="transition hover:text-[#e8c94a]">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c9a227]">Novidades</h3>
            <p className="mt-4 text-sm leading-relaxed text-[#5a4f7a]">
              Receba lançamentos e ofertas exclusivas.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="rounded-xl border border-[rgba(120,60,220,0.2)] bg-[rgba(12,8,28,0.8)] px-4 py-2.5 text-sm text-white outline-none placeholder:text-[#3d3560] focus:border-[rgba(201,162,39,0.5)]"
              />
              <button
                className="rounded-xl py-2.5 text-sm font-bold text-[#0a0612] transition hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #b8891e 0%, #e8c94a 50%, #b8891e 100%)' }}
              >
                Assinar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[rgba(120,60,220,0.1)] bg-[#030110] py-5">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-2 px-4 text-xs text-[#3d3560] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} AKsemijoias. Todos os direitos reservados.</p>
          <p>Feito para encantar.</p>
        </div>
      </div>
    </footer>
  )
}
