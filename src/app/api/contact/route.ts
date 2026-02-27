import { Resend } from 'resend';
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "krenntc@gmail.com",
      replyTo: email,
      subject: `New message from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f9f9f9;border-radius:12px;">
          <h2 style="color:#1a1a1a;margin-bottom:8px;">New contact message</h2>
          <p style="color:#555;margin-bottom:24px;font-size:14px;">Someone reached out through your portfolio.</p>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 0;color:#888;font-size:13px;width:80px;vertical-align:top;">Name</td>
              <td style="padding:10px 0;color:#1a1a1a;font-size:15px;font-weight:600;">${name}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#888;font-size:13px;vertical-align:top;">Email</td>
              <td style="padding:10px 0;color:#1a1a1a;font-size:15px;"><a href="mailto:${email}" style="color:#6c5ce7;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#888;font-size:13px;vertical-align:top;">Message</td>
              <td style="padding:10px 0;color:#1a1a1a;font-size:15px;white-space:pre-wrap;">${message}</td>
            </tr>
          </table>
          <hr style="margin:24px 0;border:none;border-top:1px solid #e5e5e5;" />
          <p style="color:#aaa;font-size:12px;">Sent from your portfolio contact form · Reply directly to this email to respond.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
