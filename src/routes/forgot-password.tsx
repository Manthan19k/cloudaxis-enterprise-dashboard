import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell, Field } from "./login";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — CloudAxis" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <AuthShell title="Reset your password" subtitle="We'll send a secure reset link to your email.">
      {sent ? (
        <div className="rounded-lg border border-border bg-card p-4 text-sm">
          A reset link has been sent to <b>{email}</b>. Check your inbox.
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.includes("@")) return toast.error("Enter a valid email");
            setSent(true);
            toast.success("Reset link sent");
          }}
          className="space-y-5"
        >
          <Field label="Work email">
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-glow">
            Send reset link
          </button>
          <div className="text-center text-sm text-muted-foreground">
            <Link to="/login" className="text-accent hover:underline">
              Back to sign in
            </Link>
          </div>
        </form>
      )}
    </AuthShell>
  );
}
