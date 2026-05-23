import { NextResponse } from 'next/server'
import { setAdminPassword } from '@/lib/settings'
import nodemailer from 'nodemailer'

function generatePassword(length = 10): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export async function POST() {
  try {
    const tempPassword = generatePassword(10)
    await setAdminPassword(tempPassword)

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: `"Floraria Clory's" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: '🔐 Parolă temporară Admin — Floraria Clory\'s',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #FDF8F9; border: 1px solid #e8ddd5;">
          <h2 style="color: #1a0509; font-size: 22px; margin-bottom: 8px;">Resetare parolă admin</h2>
          <p style="color: #555; font-size: 14px; margin-bottom: 24px;">
            Ai solicitat resetarea parolei pentru panoul de administrare Floraria Clory's.
          </p>
          <div style="background: #fff; border: 2px solid #C9A96E; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
            <p style="color: #888; font-size: 12px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 2px;">Parola temporară</p>
            <p style="color: #1a0509; font-size: 28px; font-weight: bold; letter-spacing: 4px; margin: 0;">${tempPassword}</p>
          </div>
          <p style="color: #888; font-size: 12px;">
            Intră în admin cu această parolă temporară, apoi schimb-o imediat din <strong>Setări → Schimbă parola</strong>.
          </p>
          <p style="color: #aaa; font-size: 11px; margin-top: 24px;">
            Dacă nu ai solicitat tu această resetare, ignoră acest email. Parola anterioară nu mai este validă.
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Eroare la trimiterea emailului' }, { status: 500 })
  }
}
