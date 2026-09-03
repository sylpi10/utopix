"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { submitContactForm, type ContactFormState } from "@/app/actions/contact";

const initialState: ContactFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("contact.form");

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded bg-ink px-5 py-2 text-sm text-paper transition-colors hover:bg-ochre-dark disabled:opacity-50"
    >
      {pending ? t("sending") : t("submit")}
    </button>
  );
}

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [state, formAction] = useActionState(submitContactForm, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px]"
      />

      <div>
        <label htmlFor="name" className="block text-sm text-ink-soft">
          {t("name")}
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          className="mt-1 w-full rounded border border-line bg-paper px-3 py-2 outline-none focus:border-ochre"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm text-ink-soft">
          {t("email")}
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          className="mt-1 w-full rounded border border-line bg-paper px-3 py-2 outline-none focus:border-ochre"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm text-ink-soft">
          {t("message")}
        </label>
        <textarea
          name="message"
          id="message"
          required
          rows={5}
          className="mt-1 w-full rounded border border-line bg-paper px-3 py-2 outline-none focus:border-ochre"
        />
      </div>

      <SubmitButton />

      {state.status === "success" && (
        <p className="text-sm text-sage">{t("success")}</p>
      )}
      {state.status === "error" && (
        <p className="text-sm text-red-600">{t(`errors.${state.error}`)}</p>
      )}
    </form>
  );
}
