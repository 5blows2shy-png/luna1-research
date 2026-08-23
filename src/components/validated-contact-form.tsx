"use client";

import { useRef, useState, type FormEvent } from "react";

type ContactPayload = {
  name: string;
  email: string;
  organization: string;
  subject: string;
  message: string;
  website: string;
};

export function ValidatedContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [complete, setComplete] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const fields = new FormData(form);
    const payload: ContactPayload = {
      name: String(fields.get("name") ?? "").trim(),
      email: String(fields.get("email") ?? "").trim(),
      organization: String(fields.get("organization") ?? "").trim(),
      subject: String(fields.get("subject") ?? "").trim(),
      message: String(fields.get("message") ?? "").trim(),
      website: String(fields.get("website") ?? ""),
    };

    setServerError("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        setServerError(
          response.status === 429
            ? "Too many messages have been submitted. Please wait a minute and try again."
            : "Your message could not be sent right now. Please try again later.",
        );
        return;
      }
      setComplete(true);
      formRef.current?.reset();
    } catch {
      setServerError(
        "Your message could not be sent right now. Please check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (complete) {
    return (
      <div className="success" role="status">
        <span>✓</span>
        <h2>Thank you. Your message has been sent.</h2>
        <p>Your inquiry was delivered privately. A response is not guaranteed.</p>
        <button onClick={() => setComplete(false)}>
          Submit another message
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} className="contact-form" onSubmit={submit}>
      <div className="form-grid">
        <label>
          Name
          <input
            name="name"
            autoComplete="name"
            minLength={2}
            maxLength={80}
            required
          />
        </label>
        <label>
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
          />
        </label>
        <label>
          Organization <small>(optional)</small>
          <input
            name="organization"
            autoComplete="organization"
            maxLength={120}
          />
        </label>
        <label>
          Subject
          <input name="subject" minLength={3} maxLength={120} required />
        </label>
      </div>
      <div className="contact-honeypot" aria-hidden="true">
        <label>
          Website
          <input
            name="website"
            tabIndex={-1}
            autoComplete="off"
            maxLength={200}
          />
        </label>
      </div>
      <label>
        Message
        <textarea
          name="message"
          minLength={20}
          maxLength={3000}
          rows={7}
          required
        />
      </label>
      {serverError && (
        <p role="alert" aria-live="polite">
          {serverError}
        </p>
      )}
      <button
        className="button primary"
        disabled={isSubmitting}
        type="submit"
        aria-busy={isSubmitting}
      >
        {isSubmitting ? "Sending…" : "Request connection"}
        <span>↗</span>
      </button>
      <p className="form-note">
        Your email is used only to reply to this inquiry. Contact details are not
        displayed publicly.
      </p>
    </form>
  );
}
