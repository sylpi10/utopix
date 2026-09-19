"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AccountForm({ initialEmail }: { initialEmail: string }) {
    const router = useRouter();
    const [email, setEmail] = useState(initialEmail);
    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(
        null,
    );

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setStatus(null);

        if (newPassword !== confirm) {
            setStatus({ ok: false, text: "Les mots de passe ne correspondent pas." });
            return;
        }

        setSaving(true);
        const res = await fetch("/api/admin/account", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, newPassword }),
        });
        setSaving(false);
        const data = await res.json().catch(() => ({}));

        if (res.ok) {
            setNewPassword("");
            setConfirm("");
            setStatus({ ok: true, text: "Compte mis à jour." });
            router.refresh();
        } else {
            setStatus({ ok: false, text: data.error ?? "Erreur lors de la mise à jour." });
        }
    }

    const input =
        "mt-1 w-full rounded border border-line px-3 py-2 outline-none focus:border-ochre";

    return (
        <form onSubmit={submit} className="mt-8 max-w-md space-y-4">
            <div>
                <label className="block text-sm text-ink-soft">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={input}
                    required
                />
            </div>
            <div>
                <label className="block text-sm text-ink-soft">
                    Nouveau mot de passe (laisser vide pour ne pas le changer)
                </label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    className={input}
                />
            </div>
            <div>
                <label className="block text-sm text-ink-soft">
                    Confirmer le nouveau mot de passe
                </label>
                <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                    className={input}
                />
            </div>
            <div className="flex items-center gap-4">
                <button
                    type="submit"
                    disabled={saving}
                    className="rounded bg-ink px-4 py-2 text-sm text-paper hover:bg-ochre-dark disabled:opacity-50"
                >
                    {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
                {status && (
                    <span
                        className={`text-sm ${status.ok ? "text-ink-soft" : "text-red-600"}`}
                    >
                        {status.text}
                    </span>
                )}
            </div>
        </form>
    );
}
