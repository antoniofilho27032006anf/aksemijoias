export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#120617] via-[#09040c] to-[#120617] px-6 text-white">
      <div className="flex flex-col items-center gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-[0_0_120px_rgba(255,182,193,0.12)]">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-pink-500/10 text-4xl text-pink-200 animate-pulse">
          ✨
        </div>
        <div className="space-y-3 text-center">
          <p className="text-xl font-semibold text-white">Carregando a vitrine...</p>
          <p className="max-w-md text-sm text-slate-300">Aguarde enquanto preparamos uma experiência premium para você.</p>
        </div>
      </div>
    </main>
  )
}
