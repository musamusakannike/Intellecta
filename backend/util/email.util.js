const nodemailer = require("nodemailer");

const APP_NAME = "Kodr";
const THEME = {
  bg: "#0b032d",
  card: "#1b0b5a",
  accent: "#7a3cff",
  text: "#e6e6ff",
  subtext: "#bfbfe6",
};

const SMTP_ENABLED = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

let transporter = null;
if (SMTP_ENABLED) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Boolean(process.env.SMTP_SECURE === "true" || false),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    pool: true,
    maxConnections: 2,
    maxMessages: 20,
    connectionTimeout: 10_000,
    greetingTimeout: 7_000,
    socketTimeout: 15_000,
  });
}

const baseHtml = (title, bodyHtml) => `
  <div style="background:${THEME.bg};padding:32px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;color:${THEME.text}">
    <div style="max-width:560px;margin:0 auto;background:${THEME.card};border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.06)">
      <div style="padding:24px 28px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:10px">
        <div style="width:10px;height:10px;border-radius:50%;background:${THEME.accent}"></div>
        <h1 style="margin:0;font-size:18px;letter-spacing:0.3px;color:${THEME.text}">${APP_NAME}</h1>
      </div>
      <div style="padding:28px">
        <h2 style="margin:0 0 12px 0;font-size:20px;color:${THEME.text}">${title}</h2>
        <div style="color:${THEME.subtext};font-size:14px;line-height:22px">${bodyHtml}</div>
      </div>
      <div style="padding:18px 28px;border-top:1px solid rgba(255,255,255,0.06);font-size:12px;color:${THEME.subtext}">
        You are receiving this email because you signed up for ${APP_NAME} — a space where people come to learn to code.
      </div>
    </div>
  </div>`;

function verificationHtml(name, code) {
  const codeBox = `
    <div style="margin:18px 0;padding:16px 20px;background:rgba(122,60,255,0.12);border:1px dashed ${THEME.accent};border-radius:12px;color:${THEME.text};font-size:24px;letter-spacing:6px;text-align:center;font-weight:700">${code}</div>
  `;
  const body = `
    <p>Hi ${name?.split(" ")[0] || "there"},</p>
    <p>Welcome to <b>${APP_NAME}</b> — your dark‑purple portal to mastering code. Use the verification code below to activate your account:</p>
    ${codeBox}
    <p style="margin-top:16px">This code expires in <b>15 minutes</b>. If you didn't create an account, you can safely ignore this email.</p>
  `;
  return baseHtml("Verify your email", body);
}

function welcomeHtml(name) {
  const body = `
    <p>Hi ${name?.split(" ")[0] || "there"},</p>
    <p>You're in! Your ${APP_NAME} account has been verified.</p>
    <p>Here are a few tips to get started:</p>
    <ul style="margin:10px 0 0 20px">
      <li>Pick a path and start your first lesson today.</li>
      <li>Practice daily — consistency compounds.</li>
      <li>Ask questions — the community and docs have your back.</li>
    </ul>
    <p style="margin-top:14px">Clear skies, and happy coding. ✨</p>
  `;
  return baseHtml("Welcome to Kodr", body);
}

async function sendMail({ to, subject, html }) {
  const from = process.env.FROM_EMAIL || `${APP_NAME} <no-reply@kodr.app>`;
  if (!SMTP_ENABLED) {
    // Fallback: log instead of sending to avoid hanging requests in dev
    console.warn("[email.util] SMTP not configured. Logging email instead.", { to, subject });
    return Promise.resolve({ mock: true });
  }
  return transporter.sendMail({ from, to, subject, html });
}

async function sendVerificationEmail({ to, name, code }) {
  const subject = `${APP_NAME} verification code: ${code}`;
  const html = verificationHtml(name, code);
  return sendMail({ to, subject, html });
}

async function sendWelcomeEmail({ to, name }) {
  const subject = `Welcome to ${APP_NAME} 🚀`;
  const html = welcomeHtml(name);
  return sendMail({ to, subject, html });
}

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
};
