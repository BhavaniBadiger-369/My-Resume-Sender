# Resume Sender

A full-stack bulk email outreach tool built to automate job applications — send your resume and cover letter to multiple recruiters in one click.

Built this out of a real need: manually sending applications to 10–20 recruiters every day was repetitive and slow. This tool automates it entirely.

---

## Live Demo

> Frontend: Deploy link (Vercel)
> Backend: Deploy link (Render)

---

## Features

- **Bulk email sending** — paste multiple recruiter emails (comma, semicolon, or newline separated)
- **PDF attachments** — sends your resume and cover letter automatically; upload custom files to override defaults
- **Rich HTML email** — professional styled email template sent to each recipient
- **Custom message support** — use the default cover letter or write a custom message per batch
- **Dark / Light theme** — persisted via localStorage, toggled with a single button
- **Real-time status** — live sending state with toast notifications (success / error)
- **Secure by design** — uploaded files are deleted from server immediately after sending

---

## Tech Stack

**Frontend**
- React (Vite)
- CSS custom properties for theming
- Lucide React icons
- Fetch API with FormData for multipart uploads

**Backend**
- Node.js + Express
- Nodemailer (Gmail SMTP)
- Multer (PDF file handling)
- dotenv for environment variables

---

## How It Works

1. User pastes recruiter email addresses into the form
2. Optionally uploads a custom resume or cover letter (falls back to defaults if not provided)
3. On submit, frontend sends a `multipart/form-data` POST request to the Express backend
4. Backend parses recipients, builds HTML email, attaches PDFs, and sends via Gmail SMTP using Nodemailer
5. Uploaded files are cleaned up from the server immediately after sending
6. Frontend displays success/error toast with count of emails sent

```
Frontend (React/Vite)
       │
       │  POST /send-email (multipart/form-data)
       ▼
Backend (Express)
       │
       ├── Multer → handles PDF uploads → temp storage
       ├── Nodemailer → Gmail SMTP → sends to each recipient
       └── Cleanup → deletes temp files after send
```

---

## Architecture Decisions

**Why separate frontend and backend?**
Keeping the email logic on the server side means Gmail credentials never touch the client. The `.env` file stays server-side only.

**Why Multer with cleanup?**
Uploaded files are temporary — they only need to exist long enough to attach and send. Immediate cleanup prevents storage buildup and keeps the server clean.

**Why `useMemo` for recipient parsing?**
Parsing the email list on every keystroke would be wasteful. `useMemo` recalculates only when the emails input changes, keeping the UI responsive.

**Why HTML email templating?**
Plain text emails go to spam more often. A well-structured HTML email with proper headers looks professional and has better deliverability.

---

## Problems Solved During Development

**1. Emails going to spam**
Plain text emails were landing in spam. Fixed by building a proper HTML email template with structured layout, correct headers (`from`, `replyTo`), and meaningful subject lines.

**2. File cleanup after send**
Initially uploaded files were persisting on the server. Added a `cleanupUploads()` helper that runs after every send (success or failure) to delete temp files.

**3. Theme not persisting on refresh**
Dark mode was resetting on page reload. Fixed by reading from `localStorage` on mount and writing theme preference on every toggle.

**4. Multiple email formats**
Recruiters paste emails in different formats — some comma-separated, some newline-separated, some with semicolons. Fixed with a regex split: `/[,\n;]+/` that handles all three.

---

## Setup & Running Locally

### Prerequisites
- Node.js 18+
- Gmail account with App Password enabled

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:
```
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

```bash
node server.js
# Server runs on http://localhost:5000
```

### Frontend

```bash
cd resume-sender
npm install
npm run dev
# App runs on http://localhost:5173
```

> Note: Update the API URL in `App.jsx` to point to your backend (localhost for dev, Render URL for production).

---

## Project Structure

```
My-Resume-Sender/
├── backend/
│   ├── server.js              # Express server, Nodemailer, Multer
│   ├── uploads/               # Temp storage for uploaded PDFs (auto-cleaned)
│   ├── Bhavani_Badiger_Resume.pdf        # Default resume attachment
│   ├── Bhavani_Badiger_CoverLetter.pdf   # Default cover letter attachment
│   └── .env                   # Gmail credentials (not committed)
│
└── resume-sender/
    └── src/
        ├── App.jsx             # Main UI, form logic, API call
        ├── App.css             # Theme variables, animations, layout
        └── main.jsx            # React entry point
```

---

## Future Improvements

- [ ] Deploy backend to Render for fully live demo
- [ ] Add per-recipient personalisation (name injection in email body)
- [ ] Email send history / logs
- [ ] Rate limiting to avoid Gmail daily send limits
- [ ] Drag and drop file upload

## Author

**Bhavani Badiger** — Software Developer 
[GitHub](https://github.com/BhavaniBadiger-369) · [LinkedIn](https://www.linkedin.com/in/bhavani-laxmikant-badiger-7a0902267/)


