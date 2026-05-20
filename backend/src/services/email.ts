import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM || 'AKsemijoias <onboarding@resend.dev>'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:    { label: 'Aguardando pagamento', color: '#f59e0b' },
  PAID:       { label: 'Pagamento confirmado',  color: '#10b981' },
  PROCESSING: { label: 'Em processamento',      color: '#3b82f6' },
  SHIPPED:    { label: 'Enviado',               color: '#8b5cf6' },
  DELIVERED:  { label: 'Entregue',              color: '#10b981' },
  CANCELLED:  { label: 'Cancelado',             color: '#ef4444' }
}

function baseTemplate(content: string) {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td align="center" style="padding:40px 16px">
          <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
            <tr><td style="background:#1a1a1a;padding:24px 32px;text-align:center">
              <h1 style="margin:0;color:#fff;font-size:22px;letter-spacing:1px">AKsemijoias</h1>
            </td></tr>
            <tr><td style="padding:32px">${content}</td></tr>
            <tr><td style="background:#f9fafb;padding:20px 32px;text-align:center">
              <p style="margin:0;color:#9ca3af;font-size:12px">© 2024 AKsemijoias. Todos os direitos reservados.</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `
}

export async function sendOrderCreatedEmail(to: string, data: { orderId: string; total: number }) {
  const content = `
    <h2 style="margin:0 0 8px;color:#1a1a1a">Pedido recebido!</h2>
    <p style="color:#6b7280;margin:0 0 24px">Seu pedido foi criado com sucesso.</p>
    <div style="background:#f9fafb;border-radius:8px;padding:20px;margin-bottom:24px">
      <p style="margin:0 0 8px;color:#6b7280;font-size:14px">Número do pedido</p>
      <p style="margin:0;color:#1a1a1a;font-weight:bold;font-size:18px">#${data.orderId.slice(-8).toUpperCase()}</p>
    </div>
    <div style="background:#f9fafb;border-radius:8px;padding:20px;margin-bottom:24px">
      <p style="margin:0 0 8px;color:#6b7280;font-size:14px">Total</p>
      <p style="margin:0;color:#1a1a1a;font-weight:bold;font-size:24px">R$ ${data.total.toFixed(2).replace('.', ',')}</p>
    </div>
    <p style="color:#6b7280;font-size:14px">Assim que o pagamento for confirmado, você receberá uma nova notificação.</p>
  `
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Pedido recebido! ✅',
    html: baseTemplate(content)
  })
}

export async function sendOrderStatusEmail(
  to: string,
  data: { orderId: string; status: string; description?: string }
) {
  const statusInfo = STATUS_LABELS[data.status] ?? { label: data.status, color: '#6b7280' }

  const content = `
    <h2 style="margin:0 0 8px;color:#1a1a1a">Atualização do seu pedido</h2>
    <p style="color:#6b7280;margin:0 0 24px">Houve uma atualização no status do seu pedido.</p>
    <div style="background:#f9fafb;border-radius:8px;padding:20px;margin-bottom:16px">
      <p style="margin:0 0 8px;color:#6b7280;font-size:14px">Número do pedido</p>
      <p style="margin:0;color:#1a1a1a;font-weight:bold">#${data.orderId.slice(-8).toUpperCase()}</p>
    </div>
    <div style="background:#f9fafb;border-radius:8px;padding:20px;margin-bottom:24px">
      <p style="margin:0 0 8px;color:#6b7280;font-size:14px">Status atual</p>
      <span style="display:inline-block;padding:6px 14px;border-radius:20px;background:${statusInfo.color}20;color:${statusInfo.color};font-weight:bold;font-size:14px">
        ${statusInfo.label}
      </span>
    </div>
    ${data.description ? `<p style="color:#6b7280;font-size:14px">${data.description}</p>` : ''}
  `

  const subjectMap: Record<string, string> = {
    PAID:      'Pagamento confirmado! 🎉',
    SHIPPED:   'Seu pedido foi enviado! 📦',
    DELIVERED: 'Pedido entregue! 🏠',
    CANCELLED: 'Pedido cancelado'
  }

  await resend.emails.send({
    from: FROM,
    to,
    subject: subjectMap[data.status] ?? `Pedido atualizado: ${statusInfo.label}`,
    html: baseTemplate(content)
  })
}
