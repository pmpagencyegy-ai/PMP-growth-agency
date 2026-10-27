"use client";
import { Arrow } from "./sections";
import { useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { c, serviceFrom } from "@/lib/content";
import { validateInquiry } from "@/lib/inquiry-validation";
export function InquiryForm({ enabled }: { enabled: boolean }) {
  const q = useSearchParams();
  const f = c.contactPage.form;
  const [state, setState] = useState("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const summary = useRef<HTMLDivElement>(null);
  const requestId = useRef("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!enabled || state === "submitting") return;
    const form = e.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    if (!requestId.current) requestId.current = crypto.randomUUID();
    const payload = {
      ...values,
      locale: "en",
      sourcePath: "/en/contact",
      requestId: requestId.current,
    };
    const result = validateInquiry(payload);
    if (!result.data) {
      setErrors(result.fieldErrors);
      setState("invalid");
      setTimeout(() => summary.current?.focus(), 0);
      return;
    }
    setErrors({});
    setState("submitting");
    try {
      const r = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await r.json();
      if (r.ok && body.ok) {
        setState("success");
        form.reset();
        requestId.current = "";
      } else {
        setErrors(body.fieldErrors || {});
        setState(
          r.status === 429
            ? "throttled"
            : r.status === 503
              ? "unavailable"
              : "error",
        );
      }
    } catch {
      setState("error");
    }
    setTimeout(() => summary.current?.focus(), 0);
  }
  const status =
    state === "success"
      ? f.successBody
      : state === "throttled"
        ? f.rateLimitError
        : state === "unavailable"
          ? f.unavailable
          : state === "error"
            ? f.genericError
            : state === "invalid"
              ? "Please check the highlighted fields."
              : "";
  return (
    <div id="inquiry" className="inquiry">
      <h2>{c.contactPage.formHeading}</h2>
      <p>{enabled ? c.contactPage.formIntro : f.unavailable}</p>
      <form
        onSubmit={submit}
        noValidate
        onChange={() => {
          if (state !== "submitting") requestId.current = "";
        }}
      >
        <div
          ref={summary}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className={status ? "form-status" : ""}
        >
          {status}
          {Object.keys(errors).length > 0 && (
            <ul>
              {Object.entries(errors).map(([key, value]) => (
                <li key={key}>
                  <a href={`#${key}`}>{value}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <fieldset
          disabled={!enabled || state === "submitting" || state === "success"}
        >
          <div className="form-grid">
            {[
              ["name", f.nameLabel, "text"],
              ["email", f.emailLabel, "email"],
              ["phone", f.phoneLabel, "tel"],
            ].map(([name, label, type]) => (
              <div
                className={`field ${name === "phone" ? "full" : ""}`}
                key={name}
              >
                <label htmlFor={name}>{label}</label>
                <input
                  id={name}
                  name={name}
                  type={type}
                  autoComplete={name === "phone" ? "tel" : name}
                  required={name !== "phone"}
                  maxLength={
                    name === "email" ? 254 : name === "phone" ? 32 : 100
                  }
                  aria-invalid={!!errors[name]}
                  aria-describedby={errors[name] ? `${name}-error` : undefined}
                />
                {errors[name] && (
                  <small id={`${name}-error`}>{errors[name]}</small>
                )}
              </div>
            ))}
            <div className="field full">
              <label htmlFor="serviceId">{f.serviceLabel}</label>
              <select
                id="serviceId"
                name="serviceId"
                defaultValue={serviceFrom(q.get("service"))?.id || ""}
                required
                aria-invalid={!!errors.serviceId}
                aria-describedby={
                  errors.serviceId ? "serviceId-error" : undefined
                }
              >
                <option value="">{f.servicePlaceholder}</option>
                {c.services.map((s) => (
                  <option value={s.id} key={s.id}>
                    {s.name}
                  </option>
                ))}
                <option value="not-sure">{f.otherServiceLabel}</option>
              </select>
              {errors.serviceId && (
                <small id="serviceId-error">{errors.serviceId}</small>
              )}
            </div>
            <div className="field full">
              <label htmlFor="message">{f.messageLabel}</label>
              <textarea
                id="message"
                name="message"
                minLength={20}
                maxLength={3000}
                rows={4}
                required
                aria-invalid={!!errors.message}
                aria-describedby="message-hint message-error"
              />
              <small id="message-hint">{f.messageHint}</small>
              <small id="message-error">{errors.message}</small>
            </div>
          </div>
          <div hidden aria-hidden="true">
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <p className="privacy-hint">
            We&apos;ll use these details to respond to your inquiry.{" "}
            <Link href="/en/privacy">{c.shared.privacyLabel}</Link>
          </p>
          <button className="button" type="submit">
            {state === "submitting" ? f.sending : f.submit}
            <span aria-hidden="true">
              <Arrow />
            </span>
          </button>
        </fieldset>
      </form>
      {!enabled && (
        <div className="form-alternatives">
          <a href={c.contactPage.details.emailHref}>
            Send an email <Arrow />
          </a>
          <a href={c.contactPage.details.whatsappHref}>
            Chat on WhatsApp <Arrow />
          </a>
        </div>
      )}
    </div>
  );
}
