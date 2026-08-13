const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

async function sendDemoEmail(clientEmail, clientName, demoUrl) {
  try {
    const pdfPath = path.join(__dirname, "../public/Voice_Cold_Calling_Agent_Guide.pdf");

    if (!fs.existsSync(pdfPath)) {
      throw new Error(`PDF file not found at ${pdfPath}`);
    }

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
      from: `"Priya Upadhyay (Lisa AI)" <priya@callwithlisa.in>`,
      to: clientEmail,
      replyTo: "priya@callwithlisa.in",
      cc: "priya@callwithlisa.in, upadhyaypriya974@gmail.com",
      subject: "Lisa AI - Your Personalised Demo Call Portal URL",
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 15px; color: #0F172A; line-height: 1.6; max-width: 560px; border: 1px solid #E2E8F0; padding: 24px; border-radius: 12px; background: #FFFFFF;">
          <p style="margin-top: 0;">Hii ${clientName || "there"},</p>
          
          <p>I'm <strong>Priya Upadhyay</strong> from LISA AI. Your personalized demo portal is ready!</p>
          
          <div style="background: #F8FAFC; border: 1px solid #CBD5E1; padding: 14px 18px; border-radius: 10px; margin: 16px 0;">
            <p style="margin: 0; font-size: 13px; color: #64748B;">YOUR DEMO PORTAL URL (2 Mins Free Trial):</p>
            <p style="margin: 6px 0 0 0;"><a href="${demoUrl}" style="color: #0F172A; font-weight: bold; text-decoration: underline;">${demoUrl}</a></p>
          </div>

          <p>Aapko 2 minutes milte hain demo call ke liye aap easily test kar sakte ho. If you need any assistance, our quick guide is attached below as a PDF.</p>

          <p style="margin-bottom: 0; border-top: 1px solid #E2E8F0; padding-top: 12px; font-size: 13px; color: #64748B;">
            Best regards,<br/>
            <strong>Priya Upadhyay</strong><br/>
            Founder, Lisa AI (<a href="https://callwithlisa.in" style="color: #0F172A;">callwithlisa.in</a> | priya@callwithlisa.in)
          </p>
        </div>
      `,
      attachments: [
        {
          filename: "Voice_Cold_Calling_Agent_Guide.pdf",
          path: pdfPath,
          contentType: "application/pdf",
        },
      ],
    };

    console.log(`Sending email to ${clientEmail} with attached PDF...`);
    const info = await transporter.sendMail(mailOptions);
    console.log("SUCCESS! Email sent successfully. MessageId:", info.messageId);
  } catch (err) {
    console.error("ERROR sending email:", err);
  }
}

// Test dispatch to upadhyaykanu4@gmail.com
const testEmail = "upadhyaykanu4@gmail.com";
const testName = "Kanu";
const testUrl = "https://voice-agent-final-hfv9.vercel.app/cmql8v7y90000secmfho3mukx";

sendDemoEmail(testEmail, testName, testUrl);
