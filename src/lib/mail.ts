import nodemailer from "nodemailer";

// Parses a Symfony-style mailer DSN, e.g.
// smtp://user@domain.com:password@smtp.host.com:465?encryption=ssl
function parseMailerDsn(dsn: string) {
  const url = new URL(dsn);
  const port = Number(url.port) || 587;
  const encryption = url.searchParams.get("encryption");

  return {
    host: url.hostname,
    port,
    secure: encryption === "ssl" || port === 465,
    auth: {
      user: decodeURIComponent(url.username),
      pass: decodeURIComponent(url.password),
    },
  };
}

let transporter: nodemailer.Transporter | undefined;

function getTransporter() {
  if (!transporter) {
    const dsn = process.env.MAILER_DSN;
    if (!dsn) throw new Error("MAILER_DSN is not set");
    transporter = nodemailer.createTransport(parseMailerDsn(dsn));
  }
  return transporter;
}

export async function sendContactEmail({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  const to = process.env.CONTACT_EMAIL_TO;
  if (!to) throw new Error("CONTACT_EMAIL_TO is not set");

  const dsn = process.env.MAILER_DSN;
  const fromAddress =
    process.env.MAILER_FROM ??
    (dsn ? decodeURIComponent(new URL(dsn).username) : to);

  await getTransporter().sendMail({
    from: `"Utopix — site web" <${fromAddress}>`,
    replyTo: `"${name}" <${email}>`,
    to,
    subject: `Nouveau message depuis le site Utopix — ${name}`,
    text: `${message}\n\n---\n${name} <${email}>`,
  });
}
