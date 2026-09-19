import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, getSession } from "@/lib/auth";

const MIN_PASSWORD_LENGTH = 10;

export async function PUT(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { email, newPassword } = await request.json();

    const user = await prisma.adminUser.findUnique({
        where: { email: session.email },
    });
    if (!user) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data: { email?: string; passwordHash?: string } = {};

    if (typeof email === "string" && email.trim() !== user.email) {
        const nextEmail = email.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
            return NextResponse.json(
                { error: "Email invalide" },
                { status: 400 },
            );
        }
        const taken = await prisma.adminUser.findUnique({
            where: { email: nextEmail },
        });
        if (taken) {
            return NextResponse.json(
                { error: "Cet email est déjà utilisé" },
                { status: 409 },
            );
        }
        data.email = nextEmail;
    }

    if (typeof newPassword === "string" && newPassword !== "") {
        if (newPassword.length < MIN_PASSWORD_LENGTH) {
            return NextResponse.json(
                {
                    error: `Le mot de passe doit faire au moins ${MIN_PASSWORD_LENGTH} caractères`,
                },
                { status: 400 },
            );
        }
        data.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    if (Object.keys(data).length === 0) {
        return NextResponse.json({ error: "Rien à modifier" }, { status: 400 });
    }

    const updated = await prisma.adminUser.update({
        where: { id: user.id },
        data,
    });
    await createSession(updated.email);

    return NextResponse.json({ ok: true, email: updated.email });
}
