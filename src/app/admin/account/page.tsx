import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { AccountForm } from "./AccountForm";

export default async function AdminAccountPage() {
    const session = await getSession();
    if (!session) redirect("/admin/login");

    return (
        <div>
            <Link href="/admin" className="text-sm text-ink-soft hover:text-ochre">
                ← Toutes les pages
            </Link>
            <h1 className="mt-2 font-semibold text-xl">Mon compte</h1>
            <AccountForm initialEmail={session.email} />
        </div>
    );
}
