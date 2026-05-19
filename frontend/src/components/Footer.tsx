import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#09050e] text-slate-300">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-12 px-6 py-16 sm:px-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl space-y-5">
          <span className="inline-flex rounded-full bg-pink-500/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-pink-300">
            AKsemijoias Premium
          </span>
          <div>
            <h2 className="text-3xl font-bold text-white">Brilho que combina com seu estilo.</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
              Coleções selecionadas com acabamento delicado, para quem busca elegância e conforto em cada detalhe.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Loja</h3>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              <li>
                <Link href="/" className="transition hover:text-white">
                  Coleções
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="transition hover:text-white">
                  Favoritos
                </Link>
              </li>
              <li>
                <Link href="/orders" className="transition hover:text-white">
                  Meus pedidos
                </Link>
              </li>
              <li>
                <Link href="/search" className="transition hover:text-white">
                  Buscar produtos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Ajuda</h3>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              <li>
                <a href="#" className="transition hover:text-white">
                  Atendimento
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Trocas e devoluções
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Segurança
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1 lg:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Assine nossas novidades</h3>
            <p className="mt-5 text-sm leading-7 text-slate-400">
              Receba lançamentos e ofertas exclusivas direto no seu e-mail.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="min-w-0 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-pink-300 focus:ring-2 focus:ring-pink-300/20"
              />
              <button className="rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95">
                Assinar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#0b0810] py-6">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-4 px-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <p>© {new Date().getFullYear()} AKsemijoias. Todos os direitos reservados.</p>
          <p className="text-slate-400">Feito para encantar, fácil de navegar e pronto para o seu novo brilho.</p>
        </div>
      </div>
    </footer>
  )
}
