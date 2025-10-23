require("dotenv").config();
const express    = require("express");
const cors       = require("cors");
const nodemailer = require("nodemailer");
const multer     = require("multer");
const fs         = require("fs");
const path       = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// ---------- upload ----------
const upload = multer({ dest: "uploads/" });

// ---------- identity / env with safe fallbacks ----------
const EMAIL_USER = (process.env.EMAIL_USER || "bhavanibadiger369@gmail.com").trim();
const EMAIL_PASS = ((process.env.EMAIL_PASS || "okki esho arma vrhm").replace(/\s+/g, "")).trim();

// ---------- defaults ----------
const DEFAULT_SUBJECT =
  "Application — Frontend / Full-Stack Developer | Bhavani Badiger";

// **New** detailed body text
const DEFAULT_BODY_TEXT = `
Dear Hiring Team,

I am applying for the Frontend / Full-Stack Developer role at your organization. My resume and cover letter are attached.

Experience
• ~2 years full-stack development – React.js, Node.js, Firebase, Redux, MySQL, Material-UI
• 2.5 years total industry experience

Key Skills
• Frontend: React.js, Redux, JavaScript (ES6+), HTML5, CSS3, Material-UI
• Backend & DB: Node.js, Express.js, Firebase, MySQL, basic MongoDB
• Tools: Git, Postman, Figma, Agile/Scrum workflows

Highlights
• Built and deployed company portfolio (drighna.com) with secure admin panel
• Developed BI consulting site (datalyticsfoundry.com) with dynamic blog system
• Enhanced SmartFoodSafe supplier module with new features and UI optimizations
• Awards: Spot Performer and Milestone Achiever – Drighna Technology

I would be happy to discuss how I can contribute to your team’s goals.
Thank you for your time and consideration.

Best Regards,
Bhavani Laxmikant Badiger
Email: bhavanibadiger369@gmail.com
Phone: 8217514212
LinkedIn: https://www.linkedin.com/in/bhavani-laxmikant-badiger-7a0902267/
`.trim();

// default attachments (resume + cover letter)
const DEFAULT_RESUME     = path.join(__dirname, "Bhavani_Badiger_Resume.pdf");
const DEFAULT_COVER_LETTER = path.join(__dirname, "Bhavani_Badiger_Cover_Letter.pdf");

// ---------- mail helpers ----------
function buildTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Rich HR-friendly HTML email
function defaultEmailHtml() {
  const linkedIn =
    "https://www.linkedin.com/in/bhavani-laxmikant-badiger-7a0902267/";
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no"/>
    <title>Application — Bhavani Badiger</title>
  </head>
  <body style="margin:0;padding:0;background:#f6f8fb;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f8fb;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.04);font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#222;line-height:1.6;">
            <tr>
              <td style="padding:28px 32px 8px;">
                <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#111;">Dear Hiring Team,</h2>
                <p style="margin:0 0 16px;font-size:15px;">
                  I am applying for the <strong>Frontend / Full-Stack Developer</strong> role at your organization. My resume and cover letter are attached.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 8px;">
                <h3 style="margin:0 0 8px;font-size:16px;font-weight:600;">Experience</h3>
                <ul style="padding-left:20px;margin:0 0 12px;font-size:15px;">
                  <li>~2.5 years full-stack development – <strong>React.js, Node.js, Firebase, Redux, MySQL, Material-UI</strong></li>
                 
                </ul>
                <h3 style="margin:16px 0 8px;font-size:16px;font-weight:600;">Key Skills</h3>
                <ul style="padding-left:20px;margin:0 0 12px;font-size:15px;">
                  <li><strong>Frontend:</strong> React.js, Redux, JavaScript (ES6+), HTML5, CSS3, Material-UI</li>
                  <li><strong>Backend & DB:</strong> Node.js, Express.js, Firebase, MySQL, basic MongoDB</li>
                  <li><strong>Tools:</strong> Git, Postman, Figma, Agile/Scrum workflows</li>
                </ul>
                <h3 style="margin:16px 0 8px;font-size:16px;font-weight:600;">Highlights</h3>
                <ul style="padding-left:20px;margin:0 0 12px;font-size:15px;">
                  <li>Built and deployed company portfolio (<strong>drighna.com</strong>) with secure admin panel</li>
                  <li>Developed BI consulting site (<strong>datalyticsfoundry.com</strong>) with dynamic blog system</li>
                  <li>Enhanced SmartFoodSafe supplier module with new features and UI optimizations</li>
                  <li>Awards: <em>Spot Performer</em> and <em>Milestone Achiever</em> – Drighna Technology</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 16px;">
                <p style="margin:0 0 16px;font-size:15px;">
                  I would be happy to discuss how I can contribute to your team’s goals. Thank you for your time and consideration.
                </p>
                <div style="margin:12px 0 4px;font-size:15px;font-weight:600;">Best regards,</div>
                <div style="margin:0 0 2px;font-size:15px;font-weight:600;">Bhavani Laxmikant Badiger</div>
                <div style="margin:0 0 2px;font-size:14px;">📧 <a href="mailto:bhavanibadiger369@gmail.com" style="color:#1a73e8;text-decoration:none;">bhavanibadiger369@gmail.com</a></div>
                <div style="margin:0 0 8px;font-size:14px;">📱 <a href="tel:8217514212" style="color:#1a73e8;text-decoration:none;">8217514212</a></div>
                <a href="${linkedIn}" style="display:inline-block;background:#1a73e8;color:#fff;text-decoration:none;border-radius:8px;padding:10px 14px;font-size:14px;">View LinkedIn</a>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 32px 24px;border-top:1px solid #eee;">
                <div style="font-size:12px;color:#666;">
                  Attachments: <strong>Resume (PDF)</strong> & <strong>Cover Letter (PDF)</strong>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// Plain-text to simple HTML if custom text is supplied
function wrapAsHtml(text) {
  const safe = escapeHtml(text).replace(/\n/g, "<br>");
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Message</title></head>
<body style="margin:0;padding:24px;background:#f6f8fb;">
  <div style="max-width:640px;margin:auto;background:#fff;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,.04);padding:24px;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#222;line-height:1.6;">
    ${safe}
  </div>
</body></html>`;
}

// ---------- routes ----------
app.get("/", (_req, res) => {
  res.json({ ok: true, sender: EMAIL_USER });
});

/**
 * POST /send-emailcd
 * multipart/form-data fields:
 * - emails: string (comma/semicolon/newline separated list)
 * - subject?: string
 * - body?: string   (optional; if absent, the rich default is used)
 * - resume?: file   (optional, overrides default resume)
 * - coverLetter?: file (optional, overrides default cover letter)
 */
app.post("/send-email", upload.fields([{ name: "resume" }, { name: "coverLetter" }]), async (req, res) => {
  try {
    const { emails, subject, body } = req.body || {};

    if (!emails) {
      cleanupUploads(req);
      return res.status(400).json({ error: "'emails' field is required" });
    }

    const recipients = emails
      .split(/[,\n;]+/)
      .map((e) => e.trim())
      .filter(Boolean);

    if (!recipients.length) {
      cleanupUploads(req);
      return res.status(400).json({ error: "No valid email addresses" });
    }

    const usingDefault = !body || !String(body).trim();
    const bodyText = usingDefault ? DEFAULT_BODY_TEXT : String(body).trim();
    const bodyHtml = usingDefault ? defaultEmailHtml() : wrapAsHtml(bodyText);

    const transporter = buildTransporter();

    const resumeFile = req.files?.resume?.[0];
    const coverFile  = req.files?.coverLetter?.[0];

    const attachments = [
      {
        filename: resumeFile ? resumeFile.originalname : path.basename(DEFAULT_RESUME),
        path: resumeFile ? resumeFile.path : DEFAULT_RESUME,
        contentType: "application/pdf",
      },
      {
        filename: coverFile ? coverFile.originalname : path.basename(DEFAULT_COVER_LETTER),
        path: coverFile ? coverFile.path : DEFAULT_COVER_LETTER,
        contentType: "application/pdf",
      },
    ];

    const sent = [];
    for (const email of recipients) {
      await transporter.sendMail({
        from: `"Bhavani Badiger" <${EMAIL_USER}>`,
        to: email,
        replyTo: EMAIL_USER,
        subject: (subject && subject.trim()) || DEFAULT_SUBJECT,
        text: bodyText,
        html: bodyHtml,
        attachments,
      });
      sent.push(email);
    }

    cleanupUploads(req);
    res.json({ message: "Emails sent", from: EMAIL_USER, sent });
  } catch (err) {
    console.error("Send error:", err);
    cleanupUploads(req);
    res.status(500).json({ error: "Failed to send one or more emails" });
  }
});

// remove temporary uploads
function cleanupUploads(req) {
  const all = [
    ...(req.files?.resume || []),
    ...(req.files?.coverLetter || []),
  ];
  all.forEach((f) => fs.unlink(f.path, () => {}));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
