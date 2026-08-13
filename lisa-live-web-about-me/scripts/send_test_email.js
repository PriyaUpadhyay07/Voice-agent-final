const nodemailer = require("nodemailer");

async function sendTestEmail() {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // TLS
      auth: {
        user: "upadhyaypriya974@gmail.com",
        pass: "ygzbyktvqmbnkkaa",
      },
    });

    const mailOptions = {
      from: `"Priya Upadhyay | Lisa AI" <upadhyaypriya974@gmail.com>`,
      to: "upadhyaykanu4@gmail.com",
      cc: "priya@callwithlisa.in, upadhyaypriya974@gmail.com",
      subject: "Lisa AI - Your Personalised Demo Call Portal URL",
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 15px; color: #0F172A; line-height: 1.6; max-width: 560px; border: 1px solid #E2E8F0; padding: 24px; border-radius: 12px; background: #FFFFFF;">
          <p style="margin-top: 0;">Hi Kanu,</p>
          
          <p>I'm Priya Upadhyay from <strong>LISA AI</strong>. Your personalized demo portal is ready for testing!</p>
          
          <div style="background: #F8FAFC; border: 1px solid #CBD5E1; padding: 14px 18px; border-radius: 10px; margin: 16px 0;">
            <p style="margin: 0; font-size: 13px; color: #64748B;">YOUR DEMO PORTAL URL (2 Mins Free Trial):</p>
            <p style="margin: 6px 0 0 0;"><a href="https://voice-agent-final-hfv9.vercel.app/cmql8v7y90000secmfho3mukx" style="color: #0F172A; font-weight: bold; text-decoration: underline;">https://voice-agent-final-hfv9.vercel.app/cmql8v7y90000secmfho3mukx</a></p>
          </div>

          <p>You can easily test Lisa AI outbound calling with your lead list. If you need any assistance, our quick guide is attached below.</p>

          <p style="margin-bottom: 0; border-top: 1px solid #E2E8F0; padding-top: 12px; font-size: 13px; color: #64748B;">
            Best regards,<br/>
            <strong>Priya Upadhyay</strong><br/>
            Founder, Lisa AI (<a href="https://callwithlisa.in" style="color: #0F172A;">callwithlisa.in</a>)
          </p>
        </div>
      `,
    };

    console.log("Sending email to upadhyaykanu4@gmail.com...");
    const info = await transporter.sendMail(mailOptions);
    console.log("SUCCESS! Email sent successfully. MessageId:", info.messageId);
  } catch (err) {
    console.error("ERROR sending email:", err);
  }
}

sendTestEmail();
