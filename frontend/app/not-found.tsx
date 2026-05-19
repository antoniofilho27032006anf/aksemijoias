import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0b0410] via-[#12051a] to-[#09050d] px-6 text-white">
      <div className="max-w-xl rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center shadow-[0_0_120px_rgba(255,182,193,0.16)]">
        <p className="text-sm uppercase tracking-[0.35em] text-pink-300">404 • Página não encontrada</p>
        <h1 className="mt-6 text-5xl font-black tracking-[-0.04em]">Ops, essa joia não foi encontrada.</h1>
        <p className="mt-5 text-sm leading-7 text-slate-300">
          A peça que você busca pode ter sido retirada do catálogo ou o link está incorreto. Volte para a nossa vitrine premium e continue explorando.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-8 py-4 text-sm font-semibold text-white transition hover:opacity-95"
        >
          Voltar para a loja
        </Link>
      </div>
    </main>
  )
}
