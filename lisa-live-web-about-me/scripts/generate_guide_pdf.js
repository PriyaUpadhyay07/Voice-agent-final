const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function generateGuidePDF() {
  const outputPath = path.join(__dirname, "../public/Voice_Cold_Calling_Agent_Guide.pdf");

  // Ensure public directory exists
  const publicDir = path.join(__dirname, "../public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const doc = new PDFDocument({ margin: 40 });
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  // Title Section
  doc
    .fillColor("#0F172A")
    .fontSize(22)
    .font("Helvetica-Bold")
    .text("How to Use Voice Cold Calling Agent", { align: "center" });

  doc
    .fontSize(11)
    .font("Helvetica")
    .fillColor("#475569")
    .text("Follow just a few simple steps below to get started.", { align: "center" });

  doc.moveDown(1.5);

  // Section A: Bulk Calls
  doc
    .fillColor("#0F172A")
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("A) How to Make Bulk Calls");

  doc.moveDown(0.5);

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#1E293B")
    .text("1. Click on 'New Campaign' in the left sidebar.");

  doc.moveDown(0.3);
  doc.text("2. Click on the '+' icon and upload your CSV file or Google Sheet containing your lead data. The AI agent will call these leads.");

  doc.moveDown(0.3);
  doc
    .fillColor("#166534")
    .font("Helvetica-Bold")
    .text("Note: The phone numbers you add in the sheet/CSV file must include the country code (Example: +1 2025550147 or +91 9876543210).");

  doc.moveDown(0.5);
  doc
    .fillColor("#1E293B")
    .font("Helvetica-Bold")
    .text("3. Write your script in the box:");

  doc
    .font("Helvetica")
    .text("   • First message: The initial message AI will say after the call is answered by someone. (Example: 'Hi, I'm Robert from digital marketing agency.')");

  doc
    .text("   • Description / Script: The AI agent will use this script while talking to your leads to explain your services, answer questions, and book appointments.");

  doc.moveDown(1.5);

  // Section B: Rename and New Session
  doc
    .fillColor("#0F172A")
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("B) Rename and New Session");

  doc.moveDown(0.5);
  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#1E293B")
    .text("1. You can rename your campaign anytime by clicking on the pencil button next to the campaign title.");

  doc.moveDown(0.3);
  doc.text("2. You can also start a new session anytime by clicking on the 'New Campaign' button.");

  doc.moveDown(1.5);

  // Section C: Call History
  doc
    .fillColor("#0F172A")
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("C) Call History & 9 Column Dashboard");

  doc.moveDown(0.5);
  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#1E293B")
    .text("1. Use time range filters (7D, 2W, 4W, 3M, or Custom) to analyze call data across different time periods.");

  doc.moveDown(0.3);
  doc.text("2. The Call History table tracks performance across 9 detailed columns:");

  const columns = [
    { name: "ASSISTANT NUMBER", desc: "Dedicated AI phone number used to dial leads (Keeps personal number private)." },
    { name: "CUSTOMER NUMBER", desc: "The phone number of the lead that was called." },
    { name: "TYPE", desc: "Shows whether the call was Outbound (outgoing) or Inbound (incoming)." },
    { name: "ENDED REASON", desc: "Specific reason why the call disconnected (e.g. customer-ended-call)." },
    { name: "START TIME", desc: "Exact date and time the call was placed to the lead." },
    { name: "DURATION", desc: "Total talk time between the AI agent and customer." },
    { name: "COST", desc: "Exact credit amount consumed during the call." },
    { name: "OUTCOME", desc: "Auto-tagged lead status: Interested | Not Interested | Pending." },
    { name: "RECORDING", desc: "Click 'View' to listen to recording & read full audio transcript." },
  ];

  columns.forEach((col) => {
    doc.moveDown(0.2);
    doc
      .font("Helvetica-Bold")
      .fillColor("#0F172A")
      .text(`   • ${col.name}: `, { continued: true })
      .font("Helvetica")
      .fillColor("#475569")
      .text(col.desc);
  });

  doc.moveDown(1.5);

  // Section D: Pending Calls
  doc
    .fillColor("#0F172A")
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("D) Pending Calls & Retries");

  doc.moveDown(0.5);
  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#1E293B")
    .text("• You can download unreached pending calls by clicking 'Download All Pending Calls CSV'.");

  doc.moveDown(0.2);
  doc.text("• Or go to 'Pending Calls' section and click 'Run Pending Calls' to retry dialing unreached leads.");

  doc.moveDown(1.5);

  // Section E: Credits
  doc
    .fillColor("#0F172A")
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("E) Credits & Usage Tracking");

  doc.moveDown(0.5);
  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#1E293B")
    .text("• Click 'Buy Credits' to top up your calling minutes anytime ($0.25/min pay-as-you-go).");

  doc.moveDown(0.2);
  doc.text("• Track your daily, weekly, and monthly minute consumption with interactive bar charts.");

  doc.moveDown(2);
  doc
    .fontSize(9)
    .font("Helvetica-Oblique")
    .fillColor("#64748B")
    .text("Lisa AI - Founder Priya Upadhyay (priya@callwithlisa.in)", { align: "center" });

  doc.end();

  stream.on("finish", () => {
    console.log("PDF generated successfully at:", outputPath);
  });
}

generateGuidePDF();
