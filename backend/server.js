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

I am applying for the Frontend / Full-Stack Developer role. I have 2+ years of experience building scalable web applications using React.js, Node.js, and modern web technologies.

Key Highlights:
• Developed reusable UI components and dynamic filtering features using React.js  
• Integrated REST APIs and improved application performance and data handling  
• Implemented secure authentication using JWT and Firebase  
• Built responsive and user-friendly interfaces using Material UI and Redux  
• Worked on real-time projects including CMS, recruitment system, and supplier management module  

Tech Stack:
React.js, Redux, JavaScript (ES6+), Node.js, Express.js, Firebase, MySQL, MongoDB (basic),  
TypeScript (learning), Next.js (learning)

I am currently strengthening my skills in TypeScript and Next.js and actively applying them in practice projects.

I would be happy to discuss how I can contribute to your team’s goals.

If there isn’t a suitable opportunity at your organization at the moment, I would greatly appreciate it if you could keep my profile in mind or share it within your network for relevant opportunities.

Thank you for your time and consideration.

Best Regards,  
Bhavani Badiger  
Email: bhavanibadiger369@gmail.com  
Phone: 8217514212  
LinkedIn: https://www.linkedin.com/in/bhavani-laxmikant-badiger-7a0902267/
`.trim();
// default attachments (resume + cover letter)
const DEFAULT_RESUME     = path.join(__dirname, "Bhavani_Badiger_MERN_Stack_Developer.pdf");
const DEFAULT_COVER_LETTER = path.join(__dirname, "Bhavani_Badiger_MERN_Developer_CoverLetter.pdf");

// ---------- mail helpers ----------
function buildTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });
}

// function buildTransporter() {
//   return nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,           // IMPORTANT
//     secure: true,        // MUST be true for port 465
//     auth: {
//       user: EMAIL_USER,
//       pass: EMAIL_PASS,
//     },
//     connectionTimeout: 10000,
//   });
// }

const transporter = buildTransporter();


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
  <title>Application — Bhavani Badiger</title>
</head>

<body style="margin:0;padding:0;background:#f6f8fb;">
  <table width="100%" style="padding:30px 12px;background:#f6f8fb;">
    <tr>
      <td align="center">
        <table width="650" style="background:#ffffff;border-radius:12px;padding:32px;font-family:Segoe UI,Arial,sans-serif;color:#222;line-height:1.7;">
          
          <tr>
            <td>

              <h2 style="margin-bottom:16px;font-size:22px;">Dear Hiring Team,</h2>

              <p style="font-size:16px;margin-bottom:18px;">
                I am applying for the <strong>Frontend / Full-Stack Developer</strong> role at your organization.
                I have 2+ years of experience building scalable web applications using React.js, Node.js, and modern technologies.
              </p>

              <h3 style="font-size:17px;margin-bottom:8px;">Key Highlights</h3>
              <ul style="font-size:15px;margin-bottom:18px;padding-left:20px;">
                <li style="margin-bottom:6px;">Developed reusable UI components and dynamic filtering using React.js</li>
                <li style="margin-bottom:6px;">Integrated REST APIs and improved application performance</li>
                <li style="margin-bottom:6px;">Implemented secure authentication using JWT and Firebase</li>
                <li style="margin-bottom:6px;">Built responsive UI using Material UI and Redux</li>
                <li style="margin-bottom:6px;">Worked on CMS, recruitment systems, and supplier management modules</li>
              </ul>

              <h3 style="font-size:17px;margin-bottom:8px;">Tech Stack</h3>
<ul style="font-size:15px;margin-bottom:18px;padding-left:20px;">
  <li style="margin-bottom:6px;"><strong>Frontend:</strong> React.js, Redux, JavaScript (ES6+), TypeScript, Next.js</li>
  <li style="margin-bottom:6px;"><strong>Backend:</strong> Node.js, Express.js</li>
  <li style="margin-bottom:6px;"><strong>Database:</strong> MySQL, MongoDB</li>
  <li style="margin-bottom:6px;"><strong>Other:</strong> Firebase, Material UI</li>
</ul>

              <p style="font-size:15px;margin-bottom:18px;">
                I am currently strengthening my skills in TypeScript and Next.js and actively applying them in practice projects.
              </p>

              <p style="font-size:15px;margin-bottom:18px;">
                I would be happy to discuss how I can contribute to your team’s goals.
              </p>

              <p style="font-size:15px;margin-bottom:18px;color:#444;">
                If there isn’t a suitable opportunity at your organization at the moment,
                I would greatly appreciate it if you could keep my profile in mind or share it within your network for relevant opportunities.
              </p>

              <p style="font-size:15px;margin-bottom:20px;">
                Thank you for your time and consideration.
              </p>

              <p style="font-size:15px;">
                <strong>Best Regards,</strong><br/>
                Bhavani Badiger<br/>
                📧 bhavanibadiger369@gmail.com<br/>
                📱 8217514212
              </p>

              <p style="margin-top:20px;">
                <a href="${linkedIn}" style="background:#1a73e8;color:#fff;padding:12px 16px;border-radius:8px;text-decoration:none;font-size:14px;">
                  View LinkedIn
                </a>
              </p>

              <hr style="margin:25px 0;"/>

              <p style="font-size:12px;color:#777;">
                Attachments: Resume & Cover Letter
              </p>

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
