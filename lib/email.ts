import nodemailer from 'nodemailer'
import { Order } from '@/types'

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function statusLabel(status: Order['status']): string {
  const map: Record<Order['status'], string> = {
    pending: 'În așteptare',
    confirmed: 'Confirmată',
    in_progress: 'În pregătire',
    delivered: 'Livrată',
    cancelled: 'Anulată',
  }
  return map[status]
}

export async function sendOrderConfirmationToCustomer(order: Order): Promise<void> {
  const transporter = createTransporter()

  const itemsHtml = order.items
    .map(
      item => `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #F5E6EA; font-family: 'Lato', sans-serif; color: #2A0A12;">
          ${item.productName}
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #F5E6EA; text-align: center; font-family: 'Lato', sans-serif; color: #2A0A12;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #F5E6EA; text-align: right; font-family: 'Lato', sans-serif; color: #6B1A2E; font-weight: bold;">
          ${(item.price * item.quantity).toFixed(2)} RON
        </td>
      </tr>`
    )
    .join('')

  const html = `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmare Comandă - Floraria Clory's</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FDF8F9; font-family: 'Lato', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FDF8F9; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #6B1A2E 0%, #8B2340 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
              <p style="margin: 0 0 8px 0; color: #C9A96E; font-size: 14px; letter-spacing: 3px; text-transform: uppercase; font-family: 'Lato', Arial, sans-serif;">Floraria</p>
              <h1 style="margin: 0; color: #FDF8F9; font-size: 36px; font-family: Georgia, serif; font-weight: 400;">Clory's</h1>
              <p style="margin: 12px 0 0 0; color: #F5E6EA; font-size: 13px; font-family: 'Lato', Arial, sans-serif; opacity: 0.85;">Flowers With Heart</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background: #ffffff; padding: 40px; border-left: 1px solid #F5E6EA; border-right: 1px solid #F5E6EA;">

              <h2 style="margin: 0 0 8px 0; color: #6B1A2E; font-size: 26px; font-family: Georgia, serif; font-weight: 400;">
                Mulțumim pentru comanda ta! 🌸
              </h2>
              <p style="margin: 0 0 24px 0; color: #2A0A12; font-size: 15px; line-height: 1.6;">
                Dragă <strong>${order.customer.name}</strong>,<br>
                Comanda ta a fost primită cu succes și este acum în așteptare confirmare din partea florăriei noastre.
                Vei fi contactat/ă telefonic pentru confirmare.
              </p>

              <!-- Order ID -->
              <div style="background: #F5E6EA; border-radius: 8px; padding: 16px 20px; margin-bottom: 28px; text-align: center;">
                <p style="margin: 0; color: #6B1A2E; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; font-family: 'Lato', Arial, sans-serif;">Număr Comandă</p>
                <p style="margin: 6px 0 0 0; color: #2A0A12; font-size: 24px; font-weight: 700; font-family: 'Lato', Arial, sans-serif;">${order.id}</p>
              </div>

              <!-- Products -->
              <h3 style="margin: 0 0 16px 0; color: #6B1A2E; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; font-family: 'Lato', Arial, sans-serif;">Produsele tale</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 24px;">
                <thead>
                  <tr style="background: #6B1A2E;">
                    <th style="padding: 10px 16px; text-align: left; color: #FDF8F9; font-family: 'Lato', Arial, sans-serif; font-size: 13px; font-weight: 600;">Produs</th>
                    <th style="padding: 10px 16px; text-align: center; color: #FDF8F9; font-family: 'Lato', Arial, sans-serif; font-size: 13px; font-weight: 600;">Cant.</th>
                    <th style="padding: 10px 16px; text-align: right; color: #FDF8F9; font-family: 'Lato', Arial, sans-serif; font-size: 13px; font-weight: 600;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- Totals -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                <tr>
                  <td style="padding: 6px 0; color: #2A0A12; font-family: 'Lato', Arial, sans-serif; font-size: 14px;">Subtotal</td>
                  <td style="padding: 6px 0; text-align: right; color: #2A0A12; font-family: 'Lato', Arial, sans-serif; font-size: 14px;">${order.subtotal.toFixed(2)} RON</td>
                </tr>
                ${order.discountAmount > 0 ? `
                <tr>
                  <td style="padding: 6px 0; color: #16a34a; font-family: 'Lato', Arial, sans-serif; font-size: 14px;">Discount (${order.discountCode})</td>
                  <td style="padding: 6px 0; text-align: right; color: #16a34a; font-family: 'Lato', Arial, sans-serif; font-size: 14px;">-${order.discountAmount.toFixed(2)} RON</td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 6px 0; color: #2A0A12; font-family: 'Lato', Arial, sans-serif; font-size: 14px;">Livrare</td>
                  <td style="padding: 6px 0; text-align: right; color: #2A0A12; font-family: 'Lato', Arial, sans-serif; font-size: 14px;">${order.deliveryFee === 0 ? 'GRATUIT' : order.deliveryFee.toFixed(2) + ' RON'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0 6px; border-top: 2px solid #6B1A2E; color: #6B1A2E; font-family: 'Lato', Arial, sans-serif; font-size: 16px; font-weight: 700;">TOTAL</td>
                  <td style="padding: 12px 0 6px; border-top: 2px solid #6B1A2E; text-align: right; color: #6B1A2E; font-family: 'Lato', Arial, sans-serif; font-size: 18px; font-weight: 700;">${order.total.toFixed(2)} RON</td>
                </tr>
              </table>

              <!-- Delivery Info -->
              <div style="background: #FDF8F9; border: 1px solid #F5E6EA; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 12px 0; color: #6B1A2E; font-size: 15px; font-family: 'Lato', Arial, sans-serif; text-transform: uppercase; letter-spacing: 1px;">Detalii Livrare</h3>
                <p style="margin: 0 0 6px 0; color: #2A0A12; font-size: 14px; font-family: 'Lato', Arial, sans-serif;"><strong>Data:</strong> ${formatDate(order.deliveryDate)}</p>
                <p style="margin: 0 0 6px 0; color: #2A0A12; font-size: 14px; font-family: 'Lato', Arial, sans-serif;"><strong>Interval orar:</strong> ${order.deliveryTimeSlot}</p>
                <p style="margin: 0 0 6px 0; color: #2A0A12; font-size: 14px; font-family: 'Lato', Arial, sans-serif;"><strong>Adresă:</strong> ${order.customer.address}, ${order.customer.city}</p>
                <p style="margin: 0; color: #2A0A12; font-size: 14px; font-family: 'Lato', Arial, sans-serif;"><strong>Metoda de plată:</strong> ${order.paymentMethod === 'ramburs' ? 'Ramburs la livrare' : 'Transfer bancar'}</p>
                ${order.giftMessage ? `<p style="margin: 8px 0 0 0; color: #2A0A12; font-size: 14px; font-family: 'Lato', Arial, sans-serif;"><strong>Mesaj card:</strong> "${order.giftMessage}"</p>` : ''}
              </div>

              <p style="margin: 0 0 8px 0; color: #2A0A12; font-size: 14px; line-height: 1.6; font-family: 'Lato', Arial, sans-serif;">
                Pentru orice întrebări sau modificări, ne poți contacta la:
              </p>
              <p style="margin: 0; color: #6B1A2E; font-size: 14px; font-family: 'Lato', Arial, sans-serif;">
                📞 <strong>0700 000 000</strong> &nbsp;|&nbsp; 📧 <strong>floraria@clorys.ro</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #6B1A2E; padding: 24px 40px; text-align: center; border-radius: 0 0 12px 12px;">
              <p style="margin: 0 0 8px 0; color: #F5E6EA; font-size: 13px; font-family: 'Lato', Arial, sans-serif;">Cu drag și flori proaspete,</p>
              <p style="margin: 0; color: #C9A96E; font-size: 16px; font-family: Georgia, serif;">Echipa Floraria Clory's</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  await transporter.sendMail({
    from: `"Floraria Clory's" <${process.env.GMAIL_USER}>`,
    to: order.customer.email,
    subject: `✅ Confirmare Comandă ${order.id} - Floraria Clory's`,
    html,
  })
}

export async function sendOrderNotificationToFlorist(order: Order): Promise<void> {
  const transporter = createTransporter()

  const itemsList = order.items
    .map(i => `- ${i.productName} x${i.quantity} = ${(i.price * i.quantity).toFixed(2)} RON`)
    .join('\n')

  const text = `
COMANDĂ NOUĂ PRIMITĂ!
=====================
ID: ${order.id}
Data: ${new Date(order.createdAt).toLocaleString('ro-RO')}
Status: ${statusLabel(order.status)}

CLIENT:
  Nume: ${order.customer.name}
  Telefon: ${order.customer.phone}
  Email: ${order.customer.email}
  Adresă: ${order.customer.address}, ${order.customer.city}
  ${order.customer.county ? `Județ: ${order.customer.county}` : ''}

PRODUSE:
${itemsList}

LIVRARE:
  Data: ${formatDate(order.deliveryDate)}
  Interval: ${order.deliveryTimeSlot}
  ${order.giftMessage ? `Mesaj card: "${order.giftMessage}"` : ''}

FINANCIAR:
  Subtotal: ${order.subtotal.toFixed(2)} RON
  ${order.discountAmount > 0 ? `Discount (${order.discountCode}): -${order.discountAmount.toFixed(2)} RON` : ''}
  Livrare: ${order.deliveryFee === 0 ? 'GRATUIT' : order.deliveryFee.toFixed(2) + ' RON'}
  TOTAL: ${order.total.toFixed(2)} RON
  Plată: ${order.paymentMethod === 'ramburs' ? 'Ramburs la livrare' : 'Transfer bancar'}
`

  await transporter.sendMail({
    from: `"Floraria Clory's System" <${process.env.GMAIL_USER}>`,
    to: process.env.FLORIST_EMAIL,
    subject: `🌸 Comandă Nouă: ${order.id} — ${order.customer.name} — ${order.total.toFixed(2)} RON`,
    text,
  })
}
