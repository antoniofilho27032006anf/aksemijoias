'use client'

import { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  title: string
  description?: string
  children?: ReactNode
  actions?: ReactNode
  onClose: () => void
}

export function Modal({
  open,
  title,
  description,
  children,
  actions,
  onClose
}: ModalProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 p-4 backdrop-blur-xl">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-black/40 transition duration-300 ease-out">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white">{title}</h2>
            {description ? (
              <p className="mt-2 text-sm text-slate-400">
                {description}
              </p>
            ) : null}
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 p-3 text-white transition hover:bg-white/10"
            aria-label="Fechar modal"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-4">{children}</div>

        {actions ? (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  )
}
