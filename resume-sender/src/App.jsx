import React, { useState } from "react";
import "./app.css";

export default function App() {
  const [emails,  setEmails]  = useState("");
  const [subject, setSubject] = useState("");
  const [body,    setBody]    = useState("");
  const [resume,  setResume]  = useState(null);
  const [status,  setStatus]  = useState("");
  const [sending, setSending] = useState(false);

  const recipientCount = emails
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recipientCount) {
      setStatus("Please enter at least one email address.");
      return;
    }

    const data = new FormData();
    data.append("emails", emails);
    if (subject.trim()) data.append("subject", subject);
    if (body.trim())    data.append("body", body);
    if (resume)         data.append("resume", resume);

    try {
      setSending(true);
      setStatus("Sending…");
      const res  = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      setStatus(
        res.ok
          ? `Email sent to:\n${json.sent.join("\n")}`
          : json.error
      );
    } catch {
      setStatus("Network or server error");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="container">
      <h2>Bulk HR Mailer</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            HR Emails <span className="muted">(comma-separated)</span>
          </label>
          <textarea
            className="input"
            placeholder="hr1@company.com, hr2@company.com"
            rows={3}
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
          />
          <small>{recipientCount} recipient{recipientCount !== 1 && "s"}</small>
        </div>

        <div className="form-group">
          <label>
            Subject <span className="muted">(optional)</span>
          </label>
          <input
            className="input"
            placeholder="Custom subject or leave blank"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>
            Body <span className="muted">(optional)</span>
          </label>
          <textarea
            className="input"
            placeholder="Write a custom message or leave blank"
            rows={6}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>
            Résumé PDF <span className="muted">(optional)</span>
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setResume(e.target.files[0])}
          />
          {resume && <small>Selected: {resume.name}</small>}
        </div>

        <button className="btn" disabled={sending}>
          {sending ? "Sending…" : "Send Email"}
        </button>

        {status && (
          <pre className="status">
            {status}
          </pre>
        )}
      </form>
    </main>
  );
}
