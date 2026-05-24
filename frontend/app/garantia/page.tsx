import Link from 'next/link'
import { Navbar } from '../../src/components/Navbar'
import { CartSidebar } from '../../src/components/CartSidebar'

function Section({ title }: { title: string }) {
  return (
    <h2 className="mb-3 mt-7 text-[11px] font-black uppercase tracking-[0.3em]" style={{ color: '#7C3D8E' }}>
      {title}
    </h2>
  )
}

function InfoBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border p-4 text-[13px] leading-relaxed text-gray-600" style={{ borderColor: '#e8d5f5', backgroundColor: '#faf5ff' }}>
      {children}
    </div>
  )
}

function BulletItem({ text }: { text: string }) {
  return (
    <li className="flex gap-2 text-[13px] leading-relaxed text-gray-600">
      <svg className="mt-0.5 flex-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C4509B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18l6-6-6-6"/>
      </svg>
      {text}
    </li>
  )
}

export default function GarantiaPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-xl px-4 pb-20 pt-8 sm:px-6">

        {/* Header */}
        <div className="mb-4 flex items-center gap-2">
          <div className="h-4 w-0.5 rounded-full" style={{ backgroundColor: '#7C3D8E' }} />
          <h1 className="text-base font-black uppercase tracking-[0.2em]" style={{ color: '#7C3D8E' }}>
            Garantia e Cuidados
          </h1>
        </div>

        {/* ── GARANTIA ── */}
        <Section title="Garantia" />
        <InfoBlock>
          <p className="mb-3">
            As joias da marca Rommanel possuem <strong style={{ color: '#7C3D8E' }}>garantia contra defeitos de fabricação pelo período de 1 ano</strong> a partir da data da compra.
          </p>
          <p className="mb-3">
            A garantia <strong>não cobre</strong> danos causados por mau uso, como peças quebradas, riscadas, amassadas, desgastadas pelo tempo de uso, gravadas, manchadas por contato com cosméticos, medicamentos ou produtos químicos. Também não estão incluídas peças com pedras opacas devido ao acúmulo de resíduos ou produtos sem a identificação original da marca.
          </p>
          <p>
            Para solicitar a avaliação da peça, é indispensável apresentar o <strong>certificado de garantia</strong> enviado junto ao produto.
          </p>
        </InfoBlock>

        {/* ── CUIDADOS ── */}
        <Section title="Cuidados com as joias" />
        <InfoBlock>
          <p className="mb-3">
            A Rommanel é reconhecida pela excelência em acabamento, design e qualidade em joias folheadas a <strong style={{ color: '#7C3D8E' }}>Ouro 18K</strong> e <strong style={{ color: '#7C3D8E' }}>Rhodium (Ouro Branco)</strong>.
          </p>
          <p className="mb-3 font-semibold text-gray-700">Para manter suas peças sempre bonitas e conservadas, siga estas recomendações:</p>
        </InfoBlock>

        <ul className="mt-3 flex flex-col gap-2.5">
          {[
            'Evite o contato das joias com perfumes, cremes, loções, protetor solar, pomadas e medicamentos. Alguns componentes químicos podem reagir com o banho metálico, causando perda do brilho, escurecimento ou desgaste.',
            'Antes de utilizar hidratantes ou cremes corporais, retire as peças e aguarde alguns minutos até a completa absorção do produto pela pele.',
            'Não utilize semijoias durante processos químicos nos cabelos, como tinturas, alisamentos ou descolorações. Esses produtos podem comprometer permanentemente o acabamento das peças.',
            'Shampoos específicos, principalmente os anticaspa, podem conter substâncias como enxofre e selênio, que prejudicam o brilho das pedras e do folheado.',
            'Evite lavar peças com pedras utilizando detergentes ou produtos abrasivos, pois resíduos químicos podem deixá-las opacas.',
            'Banhos muito quentes também não são recomendados para joias com pedras, já que o calor excessivo pode comprometer a fixação.',
            'Não é indicado realizar gravações em semijoias, pois isso pode danificar a camada do metal precioso aplicada sobre a peça.',
          ].map((text, i) => (
            <BulletItem key={i} text={text} />
          ))}
        </ul>

        {/* ── ORIGINAL ── */}
        <Section title="Como identificar uma joia original" />
        <InfoBlock>
          <p className="mb-3">
            As joias da Rommanel possuem um <strong style={{ color: '#7C3D8E' }}>símbolo exclusivo em formato de borboleta estilizada</strong>, utilizado como garantia de autenticidade.
          </p>
          <p className="mb-2 font-semibold text-gray-700">Essa identificação pode ser encontrada:</p>
          <ul className="flex flex-col gap-1.5">
            {[
              'nas tarraxas dos brincos',
              'nas contra-argolas de correntes e pingentes',
              'e na parte interna dos anéis',
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-[13px] text-gray-600">
                <span className="h-1.5 w-1.5 flex-none rounded-full" style={{ backgroundColor: '#C4509B' }} />
                {item}
              </li>
            ))}
          </ul>
        </InfoBlock>

        {/* ── HIPOALERGÊNICAS ── */}
        <Section title="Joias hipoalergênicas" />
        <InfoBlock>
          <p>
            As joias da Rommanel são produzidas <strong style={{ color: '#7C3D8E' }}>sem níquel</strong> em sua composição, sendo consideradas <strong>hipoalergênicas</strong> e mais adequadas para pessoas com sensibilidade a esse material.
          </p>
        </InfoBlock>

        {/* CTA WhatsApp */}
        <div className="mt-6 flex items-center gap-3 rounded-xl border p-4" style={{ borderColor: '#d1fae5', backgroundColor: '#f0fdf4' }}>
          <div className="flex h-9 w-9 flex-none items-center justify-center rounded-xl" style={{ backgroundColor: '#25D366' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <div>
            <p className="text-[12px] font-bold text-green-800">Dúvidas sobre garantia?</p>
            <a href="https://wa.me/558399038929" target="_blank" rel="noopener noreferrer" className="text-[11px] text-green-700 underline">
              (83) 9903-8929 via WhatsApp
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
