'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '../../src/components/Navbar'
import { CartSidebar } from '../../src/components/CartSidebar'

const FAQS = [
  {
    q: 'Qual a diferença entre semijoia e bijuteria?',
    a: 'Semijoias são peças confeccionadas com metais de alta qualidade (como cobre ou latão) revestidos com ouro ou prata de alta concentração. Possuem maior durabilidade e acabamento superior em relação às bijuterias comuns.',
  },
  {
    q: 'As semijoias são antialérgicas?',
    a: 'A maioria das nossas peças é confeccionada com materiais antialérgicos e livre de níquel. Caso tenha pele muito sensível, recomendamos verificar a descrição de cada produto ou nos consultar pelo WhatsApp.',
  },
  {
    q: 'Como faço para acompanhar meu pedido?',
    a: 'Após a confirmação do pagamento, você receberá o código de rastreamento por e-mail. Também pode acompanhar o status diretamente em "Meus Pedidos" na sua conta.',
  },
  {
    q: 'Quais formas de pagamento são aceitas?',
    a: 'Aceitamos PIX (com 5% de desconto!), cartão de crédito em até 6x sem juros e boleto bancário.',
  },
  {
    q: 'Qual o prazo de entrega?',
    a: 'O prazo varia de acordo com a sua região. Em média, entregamos em 5 a 12 dias úteis após a confirmação do pagamento. Regiões mais distantes podem levar um pouco mais.',
  },
  {
    q: 'Posso trocar ou devolver um produto?',
    a: 'Sim! Aceitamos trocas e devoluções em até 7 dias corridos após o recebimento, desde que a peça esteja sem uso e com embalagem original. Entre em contato pelo WhatsApp para iniciar o processo.',
  },
  {
    q: 'As fotos representam fielmente os produtos?',
    a: 'Fazemos o máximo para que as fotos representem com fidelidade as peças reais. No entanto, pode haver pequenas variações de cor dependendo da tela de cada dispositivo.',
  },
  {
    q: 'Como entrar em contato com o atendimento?',
    a: 'O atendimento é feito pelo WhatsApp (83) 9903-8929 ou pelo Instagram @aksemijoias_e_tals. Respondemos em horário comercial, de segunda a sábado.',
  },
]

export default function DuvidasPage() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-xl px-4 pb-20 pt-8 sm:px-6">

        <div className="mb-6 flex items-center gap-2">
          <div className="h-4 w-0.5 rounded-full" style={{ backgroundColor: '#7C3D8E' }} />
          <h1 className="text-base font-black uppercase tracking-[0.2em]" style={{ color: '#7C3D8E' }}>
            Tire suas Dúvidas
          </h1>
        </div>

        <p className="mb-6 text-sm text-gray-500">
          Encontre respostas para as perguntas mais comuns. Não achou o que procura? Fale com a gente pelo WhatsApp!
        </p>

        <div className="flex flex-col gap-2">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border transition-all"
              style={{ borderColor: open === i ? '#C4509B' : '#e8d5f5' }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
              >
                <span className="text-[13px] font-semibold text-gray-700">{faq.q}</span>
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke={open === i ? '#C4509B' : '#7C3D8E'} strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  className="flex-none transition-transform duration-200"
                  style={{ transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>
              {open === i && (
                <div className="border-t px-4 pb-4 pt-3" style={{ borderColor: '#f3e8ff', backgroundColor: '#faf5ff' }}>
                  <p className="text-[12px] leading-relaxed text-gray-500">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div
          className="mt-8 flex items-center gap-3 rounded-xl border p-4"
          style={{ borderColor: '#e8d5f5', backgroundColor: '#faf5ff' }}
        >
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl" style={{ backgroundColor: '#25D366' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <div>
            <p className="text-[12px] font-bold text-gray-700">Ainda tem dúvidas?</p>
            <a href="https://wa.me/558399038929" target="_blank" rel="noopener noreferrer" className="text-[11px] text-green-600 underline">
              Fale com a gente pelo WhatsApp
            </a>
          </div>
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
