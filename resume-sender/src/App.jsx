import { useState, useEffect, useMemo } from "react";
import {
  Mail,
  Rocket,
  FileText,
  Send,
  Shield,
  Clock,
  Upload,
  Info,
  Sun,
  Moon,
  Github 
} from "lucide-react";
import "./App.css";

export default function App() {
  // ================= STATE =================
  const [emails, setEmails] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [resume, setResume] = useState(null);
  const [cover, setCover] = useState(null);

  const [status, setStatus] = useState("idle");
  const [toast, setToast] = useState(null);

  // ================= THEME =================
 const [theme, setTheme] = useState("dark");


  function toggleTheme() {
  setTheme(t => (t === "dark" ? "light" : "dark"));
}

 useEffect(() => {
  document.documentElement.setAttribute("data-theme", theme);

  if (theme === "dark") {
    localStorage.setItem("rs_theme", "dark");
  }
}, [theme]);


  // ================= HELPERS =================
  const recipients = useMemo(() => {
    return emails
      .split(/[,\n;]/)
      .map(e => e.trim())
      .filter(Boolean);
  }, [emails]);

  function showToast(type, msg) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  // ================= SUBMIT (REAL BACKEND) =================
  async function handleSubmit(e) {
    e.preventDefault();

    if (!recipients.length) {
      showToast("error", "Add at least one recruiter email");
      return;
    }

    const formData = new FormData();
    formData.append("emails", recipients.join(","));
    if (subject.trim()) formData.append("subject", subject);
    if (message.trim()) formData.append("body", message);
    if (resume) formData.append("resume", resume);
    if (cover) formData.append("cover", cover);

    try {
      setStatus("sending");

      const res = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");

      setStatus("success");
      showToast(
        "success",
        `Sent to ${data.sent.length} recruiter(s) successfully`
      );

      setEmails("");
      setSubject("");
      setMessage("");
      setResume(null);
      setCover(null);

      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      console.error(err);
      setStatus("error");
      showToast("error", err.message || "Server error");
    }
  }

  // ================= UI =================
  return (
    <div className="app">
      {/* ================= HERO ================= */}
      <header className="hero">
        <button
          className="theme-btn"
          onClick={() => setTheme(t => (t === "dark" ? "light" : "dark"))}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="hero-icons">
          <div className="hero-icon float"><Mail /></div>
          <div className="hero-icon float delay"><Rocket /></div>
          <div className="hero-icon float"><FileText /></div>
        </div>

        <h1>Resume <span>Sender</span></h1>
        <p>
          Bulk Resume & Cover Letter Outreach Tool <br />
          Send personalized resumes to multiple recruiters in one click.
        </p>
      </header>

      {/* ================= FEATURES ================= */}
      <section className="container features">
       <Feature
  icon={<Send />}
  title="Bulk Sending"
  desc="Send your resume to multiple recruiters at once. Simply paste email addresses and hit send."
/>

<Feature
  icon={<Shield />}
  title="Secure & Private"
  desc="Your data stays on your device. No third-party tracking or storage."
/>

<Feature
  icon={<Clock />}
  title="Time Saving"
  desc="Automate outreach and save hours of repetitive work."
/>

      </section>

      {/* ================= MAIN ================= */}
      <main className="container main">
        {/* ===== FORM ===== */}
        <form className="card form" onSubmit={handleSubmit}>
          <h2>
            <Send size={18} /> Send Applications
          </h2>

          <Label text="Recipient Emails *" tip="Separate emails with commas, semicolons, or new lines" />
          <textarea
            value={emails}
            onChange={e => setEmails(e.target.value)}
            placeholder="recruiter@company.com, hr@company.com"
          />

          <Label text="Subject (Optional)" tip="Custom subject line for your email" />
          <input
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="Application for Fullstack / Frontend Developer – Bhavani"
          />

          <Label text="Message (Optional)" tip="Personalized message for recruiters" />
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Dear Hiring Manager..."
          />

          <div className="upload-grid">
            <UploadBox
              label="Resume (Optional)"
              file={resume}
              setFile={setResume}
            />
            <UploadBox
              label="Cover Letter (Optional)"
              file={cover}
              setFile={setCover}
            />
          </div>

          <button className="send-btn" disabled={status === "sending"}>
            {status === "sending" ? "Sending..." : "Send Applications"}
          </button>
        </form>

        {/* ===== SIDE ===== */}
        <aside className="side">
        

          <div className="card how">
            <h3>How It Works</h3>
            <HowStep icon={<Upload />} text="Upload PDF resume and cover letter" />
            <HowStep icon={<Mail />} text="Add recruiter email addresses" />
            <HowStep icon={<Send />} text="Send & track your applications" />
          </div>

          
<div className="card about-card">
  <h3>About This Project</h3>

  <p>
    This is a personal project built to simplify and speed up job applications.
    Designed with a strong focus on clean UI, usability, and real-world workflows.
  </p>

  <a
    href="https://github.com/BhavaniBadiger-369/My-Resume-Sender"
    target="_blank"
    rel="noopener noreferrer"
    className="github-link"
  >
    <Github size={18} />
    View source on GitHub
  </a>

  <span className="credit">
    Built by Bhavani Badiger
  </span>
</div>


          <div className={`card status-card status-${status}`}>
  <h3>Status</h3>

  <div className="status-row">
    {status === "idle" && <span>Ready to send</span>}
    {status === "sending" && <span>Sending applications…</span>}
    {status === "success" && <span>Applications sent successfully</span>}
    {status === "error" && <span>Failed to send applications</span>}
  </div>
</div>

        </aside>
      </main>

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}

/* ===== SMALL COMPONENTS ===== */

function Feature({ icon, title, desc }) {
  return (
    <div className="feature-card">
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}


function Label({ text, tip }) {
  return (
    <label className="label">
      {text}
      <span className="tooltip">
        <Info size={14} />
        <span className="tip">{tip}</span>
      </span>
    </label>
  );
}

function UploadBox({ label, file, setFile }) {
  return (
    <label className="upload-box">
      <Upload />
      <strong>{label}</strong>
      <span>{file ? file.name : "Drop PDF here or click to upload"}</span>
      <input
        type="file"
        accept="application/pdf"
        hidden
        onChange={e => setFile(e.target.files[0])}
      />
    </label>
  );
}

function HowStep({ icon, text }) {
  return (
    <div className="how-step">
      <div className="how-icon">{icon}</div>
      <p>{text}</p>
    </div>
  );
}
