"use server";

import { sendContactEmail } from "@/lib/mail";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  error?: "missing" | "invalid-email" | "send-failed";
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Honeypot: real visitors never see or fill this field (hidden via CSS).
  const honeypot = formData.get("company");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { status: "success" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { status: "error", error: "missing" };
  }
  if (!EMAIL_RE.test(email)) {
    return { status: "error", error: "invalid-email" };
  }

  try {
    await sendContactEmail({ name, email, message });
    return { status: "success" };
  } catch (e) {
    console.error("Contact form email failed:", e);
    return { status: "error", error: "send-failed" };
  }
}
